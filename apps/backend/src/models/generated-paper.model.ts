import { Schema, model, Types } from "mongoose";

const generatedPaperSchema = new Schema(
  {
    assignmentId: { type: Types.ObjectId, ref: "Assignment", required: true, index: true },
    paper: { type: Schema.Types.Mixed, required: true },
    pdfPath: String,
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const GeneratedPaperModel = model("GeneratedPaper", generatedPaperSchema);
