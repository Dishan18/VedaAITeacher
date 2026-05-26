import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/vedaai"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4.1"),
  JWT_SECRET: z.string().default("dev-secret"),
  UPLOAD_DIR: z.string().default("uploads"),
  GENERATED_DIR: z.string().default("generated")
});

export const env = schema.parse(process.env);
