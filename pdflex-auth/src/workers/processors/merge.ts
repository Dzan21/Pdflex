import { PDFDocument } from "pdf-lib";
import prisma from "../../prisma";
import { getObjectBuffer, putObjectBuffer } from "../../services/s3";
import { v4 as uuidv4 } from "uuid";

/**
 * MERGE job processor
 * - načíta job + vstupné súbory
 * - stiahne PDF z S3, spojí ich
 * - uloží výsledok späť do S3
 * - vytvorí File záznam a priradí ho k jobu
 */
export async function processMerge(jobId: string) {
  // 1) načítame job s inputmi
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      inputs: { include: { file: true }, orderBy: { order: "asc" } },
      user: true,
    },
  });
  if (!job) throw new Error("Job not found");
  if (!job.inputs.length) throw new Error("No input files");

  // 2) vytvoríme prázdny PDF dokument
  const merged = await PDFDocument.create();

  // 3) postupne pridáme stránky zo všetkých vstupov
  for (const input of job.inputs) {
    const buf = await getObjectBuffer(input.file.s3Key);
    const srcPdf = await PDFDocument.load(buf);
    const pages = await merged.copyPages(srcPdf, srcPdf.getPageIndices());
    for (const p of pages) merged.addPage(p);
  }

  // 4) ulož PDF do bufferu
  const out = await merged.save(); // Uint8Array
  const outBuf = Buffer.from(out);
  const pageCount = merged.getPageCount();

  // 5) upload do S3
  const key = `${job.userId}/${uuidv4()}/merged.pdf`;
  await putObjectBuffer({
    key,
    contentType: "application/pdf",
    body: outBuf,
  });

  // 6) vytvor File záznam
  const result = await prisma.file.create({
    data: {
      userId: job.userId,
      filename: "merged.pdf",
      mimeType: "application/pdf",
      size: outBuf.length,
      s3Key: key,
      pages: pageCount,
    },
  });

  // 7) prepnúť job na DONE + priradiť resultFileId
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "DONE",
      resultFileId: result.id,
      errorMessage: null,
    },
  });

  return { resultFileId: result.id, key, pageCount, size: outBuf.length };
}