import { Schema, model, Types } from "mongoose";
import { JOB_STATUSES, QUESTION_TYPES } from "@vedaai/shared-types";

const questionConfigSchema = new Schema(
  {
    id: String,
    type: { type: String, enum: QUESTION_TYPES, required: true },
    count: { type: Number, min: 1, required: true },
    marks: { type: Number, min: 1, required: true }
  },
  { _id: false }
);

const fileSchema = new Schema(
  {
    originalName: String,
    mimeType: String,
    size: Number,
    path: String
  },
  { _id: false }
);

const assignmentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "AI Generated Assessment" },
    dueDate: { type: Date, required: true },
    questionConfig: [questionConfigSchema],
    instructions: String,
    manualText: String,
    uploadedFiles: [fileSchema],
    extractedText: String,
    status: { type: String, enum: JOB_STATUSES, default: "queued", index: true },
    totalQuestions: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    resultPaperId: { type: Types.ObjectId, ref: "GeneratedPaper" },
    pdfPath: String,
    error: String
  },
  { timestamps: true }
);

export const AssignmentModel = model("Assignment", assignmentSchema);
