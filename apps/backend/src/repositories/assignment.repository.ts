import type { CreateAssignmentInput, UploadedFileMeta } from "@vedaai/shared-types";
import { AssignmentModel } from "../models/assignment.model.js";
import { GeneratedPaperModel } from "../models/generated-paper.model.js";

export async function createAssignment(userId: string, input: CreateAssignmentInput, files: UploadedFileMeta[]) {
  const totalQuestions = input.questionConfig.reduce((sum, row) => sum + row.count, 0);
  const totalMarks = input.questionConfig.reduce((sum, row) => sum + row.count * row.marks, 0);

  return AssignmentModel.create({
    userId,
    title: input.title || "AI Generated Assessment",
    dueDate: input.dueDate,
    questionConfig: input.questionConfig,
    instructions: input.instructions,
    manualText: input.manualText,
    uploadedFiles: files,
    totalQuestions,
    totalMarks,
    status: "queued"
  });
}

export async function listAssignments(userId: string, search = "", status?: string) {
  const query: Record<string, unknown> = { userId };
  if (search) query.title = { $regex: search, $options: "i" };
  if (status && status !== "all") query.status = status;

  return AssignmentModel.find(query).sort({ createdAt: -1 }).lean();
}

export async function getAssignmentWithPaper(id: string, userId: string) {
  const assignment = await AssignmentModel.findOne({ _id: id, userId }).lean();
  if (!assignment) return null;
  const paper = await GeneratedPaperModel.findOne({ assignmentId: id }).sort({ createdAt: -1 }).lean();
  return { assignment, paper };
}
