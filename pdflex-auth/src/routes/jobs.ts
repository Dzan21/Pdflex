import type { Prisma } from "@prisma/client";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import prisma from "../prisma";
import { getObjectBuffer, putObjectBuffer } from "../services/s3";

const router = express.Router();

/** --------- Create Job --------- */
const CreateJobSchema = z.object({
  type: z.enum(["MERGE", "SPLIT", "COMPRESS"]),
  inputFileIds: z.array(z.string().min(1)).min(1),
  params: z.record(z.string(), z.any()).optional(),
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const parsed = CreateJobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { type, inputFileIds, params } = parsed.data;

  // over, že vstupy patria userovi
  const files = await prisma.file.findMany({
    where: { id: { in: inputFileIds }, userId: req.user!.id },
  });
  if (files.length !== inputFileIds.length) {
    return res.status(400).json({ error: "Invalid input files" });
  }

  // vytvor job (vnorené create, aby nehaproval typ)
  const job = await prisma.job.create({
    data: {
      userId: req.user!.id,
      type,
      status: "PENDING",
      // Prisma očakáva InputJsonValue
      paramsJson: ((params ?? {}) as unknown) as Prisma.InputJsonValue,
      inputs: {
        create: inputFileIds.map((id, i) => ({ fileId: id, order: i })),
      },
    },
    include: { inputs: true },
  });

  // DEMO: COMPRESS = skopíruj prvý vstup pod novým názvom
  if (type === "COMPRESS") {
    const src = files[0];
    try {
      const buf = await getObjectBuffer(src.s3Key);
      const ext = src.filename.includes(".") ? src.filename.split(".").pop() : "pdf";
      const outName =
        src.filename.replace(/\.(\w+)$/, "") + ".compressed." + (ext || "pdf");
      const key = `${req.user!.id}/${uuidv4()}/${outName}`;

      await putObjectBuffer({ key, contentType: src.mimeType, body: buf });

      const result = await prisma.file.create({
        data: {
          userId: req.user!.id,
          filename: outName,
          mimeType: src.mimeType,
          size: buf.length,
          s3Key: key,
          pages: src.pages ?? null,
        },
      });

      const done = await prisma.job.update({
        where: { id: job.id },
        data: { status: "DONE", resultFileId: result.id },
        include: { resultFile: true },
      });

      return res.json({
        id: done.id,
        type: done.type,
        status: done.status,
        resultFile: done.resultFile
          ? { id: done.resultFile.id, filename: done.resultFile.filename }
          : undefined,
      });
    } catch (e: any) {
      const fail = await prisma.job.update({
        where: { id: job.id },
        data: { status: "ERROR", errorMessage: e?.message || "Processing failed" },
      });
      return res
        .status(500)
        .json({ id: fail.id, type, status: "ERROR", error: fail.errorMessage });
    }
  }

  // iné typy zatiaľ necháme v PENDING
  return res.json({ id: job.id, type: job.type, status: job.status });
});

/** --------- Job detail (polling) --------- */
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const job = await prisma.job.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: { resultFile: true },
  });
  if (!job) return res.status(404).json({ error: "Not found" });

  return res.json({
    id: job.id,
    type: job.type,
    status: job.status,
    errorMessage: job.errorMessage || null,
    resultFile: job.resultFile
      ? { id: job.resultFile.id, filename: job.resultFile.filename }
      : undefined,
  });
});

export default router;