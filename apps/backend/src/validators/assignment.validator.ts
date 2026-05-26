import { z } from "zod";
import { QUESTION_TYPES } from "@vedaai/shared-types";

export const createAssignmentSchema = z.object({
  title: z.string().min(2).optional(),
  dueDate: z.coerce.date(),
  instructions: z.string().max(6000).optional().default(""),
  manualText: z.string().max(50000).optional().default(""),
  timeAllowedMinutes: z.coerce.number().min(15).max(240).optional().default(45),
  questionConfig: z
    .preprocess((value) => {
      if (typeof value === "string") return JSON.parse(value);
      return value;
    }, z.array(z.object({
      id: z.string(),
      type: z.enum(QUESTION_TYPES),
      count: z.coerce.number().min(1).max(50),
      marks: z.coerce.number().min(1).max(20)
    })).min(1))
});

export type CreateAssignmentBody = z.infer<typeof createAssignmentSchema>;
