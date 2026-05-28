import { Redis } from "ioredis";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null
});

redis.on("connect", () => {
  const safeUrl = env.REDIS_URL.split("@").pop() || "unknown";
  logger.info(`Redis connected successfully to ${safeUrl}`);
});

redis.on("error", (err: Error) => {
  logger.error(`Redis connection error: ${err.message}`);
});

