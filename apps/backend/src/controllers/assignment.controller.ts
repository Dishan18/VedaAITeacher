import type { Request, Response } from "express";
import crypto from "node:crypto";
import type { QuestionConfigRow, UploadedFileMeta } from "@vedaai/shared-types";
import { createAssignmentSchema } from "../validators/assignment.validator.js";
import * as repo from "../repositories/assignment.repository.js";
import { enqueueAssignmentGeneration } from "../services/queue.service.js";

function param(value: unknown) {
  return Array.isArray(value) ? String(value[0]) : String(value);
}

function normalizeQuestionConfig(rows: unknown): QuestionConfigRow[] {
  return (rows as Array<{ id?: string; type: QuestionConfigRow["type"]; count: number; marks: number }>).map((row) => ({
    id: row.id ?? crypto.randomUUID(),
    type: row.type,
    count: Number(row.count),
    marks: Number(row.marks)
  }));
}

function normalizeFiles(files: unknown): UploadedFileMeta[] {
  return (files as UploadedFileMeta[] | undefined ?? []).map((file) => ({
    originalName: file.originalName,
    mimeType: file.mimeType,
    size: file.size,
    path: file.path
  }));
}

export async function create(req: Request, res: Response) {
  const input = createAssignmentSchema.parse(req.body);
  const files = (req.files as Express.Multer.File[] | undefined)?.map((file) => ({
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    path: file.path
  })) ?? [];

  const assignment = await repo.createAssignment(req.userId!, { ...input, dueDate: input.dueDate.toISOString() }, files);
  const job = await enqueueAssignmentGeneration(assignment.id);

  res.status(201).json({ assignmentId: assignment.id, jobId: job.id, status: assignment.status });
}

export async function list(req: Request, res: Response) {
  const assignments = await repo.listAssignments(
    req.userId!,
    String(req.query.search ?? ""),
    req.query.status ? String(req.query.status) : undefined
  );

  res.json({
    assignments: assignments.map((assignment) => ({
      id: String(assignment._id),
      title: assignment.title,
      dueDate: assignment.dueDate,
      assignedOn: assignment.createdAt,
      status: assignment.status,
      totalQuestions: assignment.totalQuestions,
      totalMarks: assignment.totalMarks
    }))
  });
}

export async function show(req: Request, res: Response) {
  const data = await repo.getAssignmentWithPaper(param(req.params.id), req.userId!);
  if (!data) return res.status(404).json({ message: "Assignment not found" });
  return res.json(data);
}

export async function remove(req: Request, res: Response) {
  const id = param(req.params.id);
  const data = await repo.getAssignmentWithPaper(id, req.userId!);
  if (!data) return res.status(404).json({ message: "Assignment not found" });
  await import("../models/assignment.model.js").then(({ AssignmentModel }) => AssignmentModel.deleteOne({ _id: id }));
  res.status(204).send();
}

export async function duplicate(req: Request, res: Response) {
  const data = await repo.getAssignmentWithPaper(param(req.params.id), req.userId!);
  if (!data) return res.status(404).json({ message: "Assignment not found" });
  const duplicateAssignment = await repo.createAssignment(req.userId!, {
    title: `${data.assignment.title} Copy`,
    dueDate: new Date(data.assignment.dueDate).toISOString(),
    questionConfig: normalizeQuestionConfig(data.assignment.questionConfig),
    instructions: data.assignment.instructions ?? undefined,
    manualText: data.assignment.manualText ?? undefined,
    timeAllowedMinutes: data.paper?.paper?.timeAllowedMinutes ?? 45
  }, normalizeFiles(data.assignment.uploadedFiles));
  const job = await enqueueAssignmentGeneration(duplicateAssignment.id);
  res.status(201).json({ assignmentId: duplicateAssignment.id, jobId: job.id });
}

export async function regenerate(req: Request, res: Response) {
  const id = param(req.params.id);
  const data = await repo.getAssignmentWithPaper(id, req.userId!);
  if (!data) return res.status(404).json({ message: "Assignment not found" });
  const job = await enqueueAssignmentGeneration(id);
  res.status(202).json({ assignmentId: id, jobId: job.id });
}
