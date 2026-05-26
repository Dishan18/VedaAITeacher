import { Worker } from "bullmq";
import type { QuestionConfigRow } from "@vedaai/shared-types";
import { redis } from "../config/redis.js";
import { connectDatabase } from "../config/db.js";
import { AssignmentModel } from "../models/assignment.model.js";
import { GeneratedPaperModel } from "../models/generated-paper.model.js";
import { extractTextFromFiles } from "../services/file-processing.service.js";
import { generateAssessment } from "../services/ai.service.js";
import { createPaperPdf } from "../services/pdf.service.js";
import { publishProgress } from "../services/progress.service.js";
import { logger } from "../utils/logger.js";

await connectDatabase();

function normalizeQuestionConfig(rows: unknown): QuestionConfigRow[] {
  return (rows as Array<{ id?: string; type: QuestionConfigRow["type"]; count: number; marks: number }>).map((row, index) => ({
    id: row.id ?? `row-${index}`,
    type: row.type,
    count: Number(row.count),
    marks: Number(row.marks)
  }));
}

new Worker(
  "assignment-generation",
  async (job) => {
    const { assignmentId } = job.data as { assignmentId: string };
    const jobId = String(job.id);
    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    await publishProgress(assignmentId, jobId, "processing", 15, "Reading source material");
    const extractedText = await extractTextFromFiles((assignment.uploadedFiles ?? []).map((file) => ({
      originalName: file.originalName ?? "upload",
      mimeType: file.mimeType ?? "text/plain",
      path: file.path ?? undefined
    })));

    await AssignmentModel.findByIdAndUpdate(assignmentId, { extractedText });
    await publishProgress(assignmentId, jobId, "generating_questions", 42, "Designing balanced questions");

    const paper = await generateAssessment({
      title: assignment.title,
      dueDate: assignment.dueDate.toISOString(),
      questionConfig: normalizeQuestionConfig(assignment.questionConfig),
      instructions: assignment.instructions ?? undefined,
      manualText: assignment.manualText ?? undefined,
      timeAllowedMinutes: 45
    }, extractedText);

    await publishProgress(assignmentId, jobId, "generating_answers", 70, "Preparing answer key");
    const generated = await GeneratedPaperModel.create({ assignmentId, paper });

    await publishProgress(assignmentId, jobId, "creating_pdf", 86, "Creating printable PDF");
    const pdfPath = await createPaperPdf(paper, assignmentId);

    generated.pdfPath = pdfPath;
    await generated.save();
    await AssignmentModel.findByIdAndUpdate(assignmentId, {
      resultPaperId: generated.id,
      pdfPath,
      status: "completed"
    });
    await publishProgress(assignmentId, jobId, "completed", 100, "Assessment ready");
  },
  { connection: redis, concurrency: 3 }
).on("failed", async (job, error) => {
  logger.error(error);
  if (job?.data.assignmentId) {
    await publishProgress(job.data.assignmentId, String(job.id), "failed", 100, error.message);
  }
});

logger.info("Assignment worker started");
