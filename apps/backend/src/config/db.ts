import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  const safeUri = env.MONGODB_URI.split("@").pop() || "unknown";
  logger.info(`Connecting to MongoDB at ${safeUri}...`);
  await mongoose.connect(env.MONGODB_URI);
  logger.info("MongoDB connected successfully");
}
