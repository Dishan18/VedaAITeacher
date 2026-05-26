import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

export const assignmentQueue = new Queue("assignment-generation", {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 4000 },
    removeOnComplete: { age: 86400, count: 1000 },
    removeOnFail: { age: 604800 }
  }
});

export const pdfQueue = new Queue("pdf-generation", {
  connection: redis,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 3000 }
  }
});

export async function enqueueAssignmentGeneration(assignmentId: string) {
  return assignmentQueue.add("generate", { assignmentId });
}
