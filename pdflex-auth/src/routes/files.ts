// src/routes/files.ts
import express from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";

import prisma from "../prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import {
  getPresignedUploadUrl,
  deleteObject,
  getPresignedDownloadUrl,
  putObjectBuffer, // ⬅️ pridané
} from "../services/s3";

const router = express.Router();

/* ===================== Multer (fallback upload) ===================== */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

/* ===================== Presigned upload (priame PUT na S3) ===================== */
const PresignSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().positive(),
});

router.post("/presign-upload", requireAuth, async (req: AuthRequest, res) => {
  const parsed = PresignSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { filename, mimeType, size } = parsed.data;
  const safeName = filename.replace(/[^\w.\-]+/g, "_");
  const key = `${req.user!.id}/${uuidv4()}/${safeName}`;

  const presigned = await getPresignedUploadUrl({
    key,
    contentType: mimeType,
    expiresIn: 900, // 15 min
  });

  return res.json({
    upload: presigned, // { url, method:"PUT", key, headers:{Content-Type} }
    fileDraft: { filename, mimeType, size, s3Key: key },
    next: "PUT the file to upload.url, then call POST /api/files/complete",
  });
});

/* Potvrdenie po úspešnom nahratí do S3 + zápis do DB */
const CompleteSchema = z.object({
  s3Key: z.string().min(3),
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().positive(),
  pages: z.number().int().positive().optional(),
});

router.post("/complete", requireAuth, async (req: AuthRequest, res) => {
  const parsed = CompleteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { s3Key, filename, mimeType, size, pages } = parsed.data;

  const file = await prisma.file.create({
    data: {
      userId: req.user!.id,
      filename,
      mimeType,
      size,
      s3Key,
      pages: pages ?? null,
    },
  });

  return res.json({ file });
});

/* ===================== Fallback upload cez backend ===================== */
/**
 * FE pošle multipart/form-data (pole `files`), backend uloží do S3 a vytvorí záznamy v DB.
 * Nepotrebuje CORS, takže funguje aj keď MinIO CORS ešte nemáme nastavený.
 */
router.post(
  "/upload-local",
  requireAuth,
  upload.array("files", 10),
  async (req: AuthRequest, res) => {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      if (!files.length) return res.status(400).json({ error: "No files" });

      const saved = [];
      for (const f of files) {
        const safeName = f.originalname.replace(/[^\w.\-]+/g, "_");
        const key = `${req.user!.id}/${uuidv4()}/${safeName}`;

        // uloženie binárky do S3/MinIO
        await putObjectBuffer({
          key,
          contentType: f.mimetype || "application/octet-stream",
          body: f.buffer,
        });

        // záznam do DB
        const rec = await prisma.file.create({
          data: {
            userId: req.user!.id,
            filename: f.originalname,
            mimeType: f.mimetype || "application/octet-stream",
            size: f.size,
            s3Key: key,
          },
        });

        saved.push(rec);
      }

      return res.json({ files: saved });
    } catch (e: any) {
      console.error("upload-local error:", e);
      return res.status(500).json({ error: e?.message || "Upload failed" });
    }
  }
);

/* ===================== Zoznam, zmazanie, download URL ===================== */
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const files = await prisma.file.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ files });
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const id = req.params.id;
  const file = await prisma.file.findFirst({
    where: { id, userId: req.user!.id },
  });
  if (!file) return res.status(404).json({ error: "Not found" });

  try {
    await deleteObject(file.s3Key);
  } catch (e) {
    console.warn("S3 delete failed:", e);
  }

  await prisma.file.delete({ where: { id } });
  return res.json({ ok: true });
});

router.get("/:id/download-url", requireAuth, async (req: AuthRequest, res) => {
  const id = req.params.id;

  const file = await prisma.file.findFirst({
    where: { id, userId: req.user!.id },
  });
  if (!file) return res.status(404).json({ error: "Not found" });

  const url = await getPresignedDownloadUrl({ key: file.s3Key, expiresIn: 900 });
  return res.json({ url, expiresIn: 900 });
});

export default router;