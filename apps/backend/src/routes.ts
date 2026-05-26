import fs from "node:fs";
import express from "express";
import multer from "multer";
import { env } from "./config/env.js";
import * as assignments from "./controllers/assignment.controller.js";
import { mockAuth } from "./middleware/auth.js";

fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });

const upload = multer({
  dest: env.UPLOAD_DIR,
  limits: { fileSize: 10 * 1024 * 1024, files: 4 }
});

export const router = express.Router();

router.get("/health", (_req, res) => res.json({ ok: true, service: "vedaai-backend" }));

router.use(mockAuth);
router.get("/me", (_req, res) =>
  res.json({
    teacher: {
      name: "John Doe",
      email: "john.doe@dpsbokaro.edu",
      school: { name: "Delhi Public School", city: "Bokaro Steel City" }
    }
  })
);
router.get("/assignments", assignments.list);
router.post("/assignments", upload.array("files"), assignments.create);
router.get("/assignments/:id", assignments.show);
router.delete("/assignments/:id", assignments.remove);
router.post("/assignments/:id/duplicate", assignments.duplicate);
router.post("/assignments/:id/regenerate", assignments.regenerate);
