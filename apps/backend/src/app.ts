import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { router } from "./routes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { logger } from "./utils/logger.js";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(rateLimit({ windowMs: 60_000, limit: 120 }));
  app.use(express.json({ limit: "2mb" }));
  app.use(pinoHttp({ logger }));
  app.use("/api", router);
  app.use("/generated", express.static(env.GENERATED_DIR));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
