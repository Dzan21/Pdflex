// src/routes/tools.ts
import express from "express";
import { z } from "zod";
import prisma from "../prisma";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import {
  getObjectBuffer,
  putObjectBuffer,
  getPresignedDownloadUrl,
} from "../services/s3";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import { v4 as uuidv4 } from "uuid";

// --- HTTP/multipart utily pre Node ---
import fetch, { Response } from "node-fetch";
import FormData from "form-data";

const router = express.Router();

/* ============================================================================
   CONFIG
============================================================================ */
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || "";
// ak nie je zadané BASE, vyberie sa podľa suffixu :fx (FREE)
const DEEPL_API_BASE_RAW =
  process.env.DEEPL_API_BASE ||
  (DEEPL_API_KEY.endsWith(":fx")
    ? "https://api-free.deepl.com"
    : "https://api.deepl.com");
const DEEPL_V2 = `${DEEPL_API_BASE_RAW.replace(/\/$/, "")}/v2`;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function safeJson(res: Response | any) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/* ============================================================================
   HELPERS: Ghostscript pre kompresiu
============================================================================ */
function gsArgsForPreset(
  preset: "screen" | "ebook" | "printer" | "prepress" | "default"
) {
  // https://ghostscript.com/docs/9.53.3/Ps2pdf.htm#Settings
  const map: Record<string, string> = {
    screen: "/screen", // ~72dpi
    ebook: "/ebook", // ~150dpi
    printer: "/printer", // ~300dpi
    prepress: "/prepress", // ~300dpi, lepší text
    default: "/default",
  };
  return map[preset] || "/ebook";
}

async function runGhostscript(
  inputFile: string,
  outputFile: string,
  preset: string,
  timeoutMs = 2 * 60 * 1000
) {
  const pdfSetting = gsArgsForPreset(preset as any);
  const args = [
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.4",
    `-dPDFSETTINGS=${pdfSetting}`,
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    `-sOutputFile=${outputFile}`,
    inputFile,
  ];

  await new Promise<void>((resolve, reject) => {
    const child = spawn("gs", args);
    let stderr = "";

    const killer = setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } catch {}
      reject(new Error("Ghostscript timed out."));
    }, timeoutMs);

    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (err) => {
      clearTimeout(killer);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(killer);
      if (code === 0) resolve();
      else reject(new Error(`Ghostscript exited with code ${code}. ${stderr}`));
    });
  });
}

/* ============================================================================
   /tools/compress  (Tvoja funkčná verzia, zachovaná)
============================================================================ */
const CompressSchema = z.object({
  fileId: z.string().min(1),
  preset: z
    .enum(["screen", "ebook", "printer", "prepress", "default"])
    .default("ebook"),
});

router.post(
  "/compress",
  requireAuth,
  async (req: AuthRequest, res: express.Response) => {
    try {
      const parsed = CompressSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }
      const { fileId, preset } = parsed.data;

      const src = await prisma.file.findFirst({
        where: { id: fileId, userId: req.user!.id },
      });
      if (!src) return res.status(404).json({ error: "File not found" });
      if (src.mimeType !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF is supported" });
      }

      const inputBuf = await getObjectBuffer(src.s3Key);

      const tmp = os.tmpdir();
      const inPath = path.join(tmp, `pdflex-in-${uuidv4()}.pdf`);
      const outPath = path.join(tmp, `pdflex-out-${uuidv4()}.pdf`);
      await fs.writeFile(inPath, inputBuf);

      let outBuf: Buffer | null = null;

      try {
        await runGhostscript(inPath, outPath, preset);
        outBuf = await fs.readFile(outPath);
      } finally {
        try {
          await fs.unlink(inPath);
        } catch {}
        try {
          await fs.unlink(outPath);
        } catch {}
      }

      if (!outBuf || outBuf.length === 0) {
        return res.status(500).json({ error: "Compression produced empty file." });
      }

      const safeName = src.filename.replace(/[^\w.\-]+/g, "_");
      const newKey = `${req.user!.id}/${uuidv4()}/compressed-${safeName}`;

      await putObjectBuffer({
        key: newKey,
        contentType: "application/pdf",
        body: outBuf,
      });

      const outFile = await prisma.file.create({
        data: {
          userId: req.user!.id,
          filename: `compressed-${src.filename}`,
          mimeType: "application/pdf",
          size: outBuf.length,
          s3Key: newKey,
          pages: src.pages ?? null,
        },
      });

      const url = await getPresignedDownloadUrl({
        key: newKey,
        expiresIn: 900,
      });

      const originalBytes = inputBuf.length;
      const compressedBytes = outBuf.length;
      const savedBytes = Math.max(0, originalBytes - compressedBytes);
      const savedPercent =
        originalBytes > 0 ? (savedBytes / originalBytes) * 100 : 0;

      return res.json({
        file: {
          id: outFile.id,
          filename: outFile.filename,
          size: outFile.size,
          mimeType: outFile.mimeType,
          createdAt: outFile.createdAt,
        },
        downloadUrl: url,
        expiresIn: 900,
        stats: {
          preset,
          originalBytes,
          compressedBytes,
          savedBytes,
          savedPercent: Number(savedPercent.toFixed(1)),
          improved: compressedBytes < originalBytes,
        },
      });
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (msg.includes("ENOENT") && (msg.includes("gs") || msg.includes("spawn"))) {
        return res.status(500).json({
          error:
            "Ghostscript (gs) nie je nainštalovaný alebo nie je v PATH. Na macOS: `brew install ghostscript`.",
        });
      }
      return res.status(500).json({ error: msg || "Compress failed." });
    }
  }
);

/* ============================================================================
   /tools/translate  — DeepL Document API (ALL LANGS)
============================================================================ */

// GET /api/tools/translate/languages  -> všetky target jazyky
router.get(
  "/translate/languages",
  requireAuth,
  async (_req: AuthRequest, res: express.Response) => {
    if (!DEEPL_API_KEY) {
      return res.status(500).json({ error: "DEEPL_API_KEY nie je nastavený." });
    }
    try {
      const r: Response = await fetch(`${DEEPL_V2}/languages?type=target`, {
        headers: { Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}` },
      });

      if (!r.ok) {
        const j = await safeJson(r);
        return res.status(r.status).json({
          error: `DeepL languages failed (${r.status})`,
          details: j,
        });
      }

      const langs = (await r.json()) as Array<{
        language: string;
        name: string;
        supports_formality?: boolean;
      }>;

      return res.json({
        languages: langs.map((l) => ({
          code: l.language, // EN-GB, DE, CS, SK…
          name: l.name,
          supports_formality: !!l.supports_formality,
        })),
      });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "DeepL failed." });
    }
  }
);

// POST /api/tools/translate  -> preklad PDF (auto detect source)
const TranslateSchema = z.object({
  fileId: z.string().min(1),
  targetLang: z.string().min(2),          // EN, DE, CS, SK, EN-GB...
  sourceLang: z.string().optional(),      // ak dodáš, použije sa
  formality: z.enum(["default", "more", "less"]).optional(),
});

router.post(
  "/translate",
  requireAuth,
  async (req: AuthRequest, res: express.Response) => {
    if (!DEEPL_API_KEY) {
      return res.status(500).json({ error: "DEEPL_API_KEY nie je nastavený." });
    }

    try {
      const parsed = TranslateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }
      const { fileId, targetLang, sourceLang, formality } = parsed.data;

      // 1) user file
      const src = await prisma.file.findFirst({
        where: { id: fileId, userId: req.user!.id },
      });
      if (!src) return res.status(404).json({ error: "File not found" });
      if (src.mimeType !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF is supported" });
      }

      // 2) download from S3
      const inputBuf = await getObjectBuffer(src.s3Key);

      // 3) create DeepL document
      const form = new FormData();
      form.append("file", inputBuf, {
        filename: src.filename || "document.pdf",
        contentType: "application/pdf",
      } as any);
      form.append("target_lang", targetLang.toUpperCase());
      if (sourceLang && sourceLang.trim()) {
        form.append("source_lang", sourceLang.toUpperCase());
      }
      if (formality) {
        form.append("formality", formality);
      }

      const createRes: Response = await fetch(`${DEEPL_V2}/document`, {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          ...form.getHeaders(),
        } as any,
        body: form as any, // node stream
      });

      if (!createRes.ok) {
        const j = await safeJson(createRes);
        return res.status(502).json({
          error: `DeepL create failed: ${createRes.status}`,
          details: j,
        });
      }

      const created = (await createRes.json()) as {
        document_id: string;
        document_key: string;
      };

      // 4) poll status
      let tries = 0;
      let detectedSourceLang: string | undefined;

      while (true) {
        await sleep(1200);
        tries++;

        const sRes: Response = await fetch(
          `${DEEPL_V2}/document/${created.document_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            },
            body: new URLSearchParams({
              document_key: created.document_key,
            }),
          }
        );

        if (!sRes.ok) {
          const j = await safeJson(sRes);
          return res.status(502).json({
            error: `DeepL status failed: ${sRes.status}`,
            details: j,
          });
        }

        const s = (await sRes.json()) as {
          status: "queued" | "translating" | "done" | "error";
          seconds_remaining?: number;
          detected_source_lang?: string;
          message?: string;
        };

        if (s.detected_source_lang) detectedSourceLang = s.detected_source_lang;

        if (s.status === "done") break;
        if (s.status === "error") {
          return res
            .status(502)
            .json({ error: "DeepL translation error", details: s.message });
        }
        if (tries > 180) {
          return res.status(504).json({ error: "DeepL translation timeout." });
        }
      }

      // 5) download result (PDF)
      const dlRes: Response = await fetch(
        `${DEEPL_V2}/document/${created.document_id}/result`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          },
          body: new URLSearchParams({
            document_key: created.document_key,
          }),
        }
      );

      if (!dlRes.ok) {
        const j = await safeJson(dlRes);
        return res.status(502).json({
          error: `DeepL result failed: ${dlRes.status}`,
          details: j,
        });
      }

      const arrayBuf = await dlRes.arrayBuffer();
      const outBuf = Buffer.from(arrayBuf);

      // 6) upload do S3 + DB
      const safeName = src.filename.replace(/[^\w.\-]+/g, "_");
      const newKey = `${req.user!.id}/${uuidv4()}/translated-${targetLang.toUpperCase()}-${safeName}`;

      await putObjectBuffer({
        key: newKey,
        contentType: "application/pdf",
        body: outBuf,
      });

      const outFile = await prisma.file.create({
        data: {
          userId: req.user!.id,
          filename: `translated-${targetLang.toUpperCase()}-${src.filename}`,
          mimeType: "application/pdf",
          size: outBuf.length,
          s3Key: newKey,
          pages: src.pages ?? null,
        },
      });

      const url = await getPresignedDownloadUrl({
        key: newKey,
        expiresIn: 900,
      });

      return res.json({
        file: {
          id: outFile.id,
          filename: outFile.filename,
          size: outFile.size,
          mimeType: outFile.mimeType,
          createdAt: outFile.createdAt,
        },
        downloadUrl: url,
        expiresIn: 900,
        meta: {
          targetLang: targetLang.toUpperCase(),
          detectedSourceLang: detectedSourceLang || null,
        },
      });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "Translate failed." });
    }
  }
);

export default router;