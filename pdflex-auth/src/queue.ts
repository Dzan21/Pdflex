import { Queue } from "bullmq";

export const QUEUE_NAME = "pdf_jobs"; // <- bez dvojbodky

const connection = {
  connection: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
};

export const pdfQueue = new Queue(QUEUE_NAME, connection);

export async function enqueuePdfJob(jobId: string, type: string) {
  await pdfQueue.add(
    "process",
    { jobId, type },
    {
      removeOnComplete: true,
      removeOnFail: false,
      attempts: 1,
    }
  );
}