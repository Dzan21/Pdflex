import { Worker, QueueEvents } from "bullmq";
import pino from "pino";
import prisma from "../prisma";
import { QUEUE_NAME } from "../queue";
import { processMerge } from "./processors/merge";

const logger = pino({ name: "pdf-worker", level: "info" });
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const events = new QueueEvents(QUEUE_NAME, { connection: { url: redisUrl } });
events.on("completed", ({ jobId }) => logger.info({ jobId }, "Job completed"));
events.on("failed", ({ jobId, failedReason }) =>
  logger.error({ jobId, failedReason }, "Job failed")
);

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const { jobId, type } = job.data as { jobId: string; type: string };

    // prepnúť DB → PROCESSING
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "PROCESSING", errorMessage: null },
    });

    try {
      switch (type) {
        case "MERGE":
          await processMerge(jobId);
          break;
        default:
          throw new Error(`Unsupported job type: ${type}`);
      }

      // (processMerge už nastaví DONE + resultFileId)
      return true;
    } catch (err: any) {
      const msg = err?.message || String(err);
      await prisma.job.update({
        where: { id: jobId },
        data: { status: "ERROR", errorMessage: msg },
      });
      throw err;
    }
  },
  { connection: { url: redisUrl } }
);

worker.on("error", (err) => logger.error({ err }, "Worker error"));