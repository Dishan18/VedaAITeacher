import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger.js";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  logger.error(error);
  if (error instanceof ZodError) {
    return res.status(422).json({ message: "Validation failed", issues: error.issues });
  }

  const message = error instanceof Error ? error.message : "Internal server error";
  return res.status(500).json({ message });
}
