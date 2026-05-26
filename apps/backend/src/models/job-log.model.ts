import { Schema, model, Types } from "mongoose";
import { JOB_STATUSES } from "@vedaai/shared-types";

const jobLogSchema = new Schema(
  {
    assignmentId: { type: Types.ObjectId, ref: "Assignment", required: true, index: true },
    jobId: String,
    status: { type: String, enum: JOB_STATUSES, required: true },
    progress: Number,
    message: String,
    meta: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const JobLogModel = model("JobLog", jobLogSchema);
