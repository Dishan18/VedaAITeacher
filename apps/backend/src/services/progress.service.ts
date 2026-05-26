import type { JobStatus } from "@vedaai/shared-types";
import { AssignmentModel } from "../models/assignment.model.js";
import { JobLogModel } from "../models/job-log.model.js";
import { emitProgress } from "../socket/realtime.js";

export async function publishProgress(
  assignmentId: string,
  jobId: string,
  status: JobStatus,
  progress: number,
  message?: string
) {
  await AssignmentModel.findByIdAndUpdate(assignmentId, { status, ...(status === "failed" ? { error: message } : {}) });
  await JobLogModel.create({ assignmentId, jobId, status, progress, message });
  emitProgress({ assignmentId, jobId, status, progress, message });
}
