export const JOB_STATUSES = [
  "queued",
  "processing",
  "generating_questions",
  "generating_answers",
  "creating_pdf",
  "completed",
  "failed"
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const QUESTION_TYPES = [
  "MCQ",
  "Short Questions",
  "Long Questions",
  "Diagram/Graph Based",
  "Numerical Problems"
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export type Difficulty = "easy" | "moderate" | "challenging";

export interface QuestionConfigRow {
  id: string;
  type: QuestionType;
  count: number;
  marks: number;
}

export interface UploadedFileMeta {
  originalName: string;
  mimeType: string;
  size: number;
  path?: string;
}

export interface CreateAssignmentInput {
  title?: string;
  dueDate: string;
  questionConfig: QuestionConfigRow[];
  instructions?: string;
  manualText?: string;
  timeAllowedMinutes?: number;
}

export interface GeneratedQuestion {
  question: string;
  difficulty: Difficulty;
  marks: number;
  answer: string;
  type?: QuestionType;
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  title: string;
  subject: string;
  class: string;
  schoolName: string;
  timeAllowedMinutes: number;
  maximumMarks: number;
  sections: GeneratedSection[];
}

export interface AssignmentSummary {
  id: string;
  title: string;
  dueDate: string;
  assignedOn: string;
  status: JobStatus;
  totalQuestions: number;
  totalMarks: number;
  subject?: string;
}

export interface JobProgressEvent {
  assignmentId: string;
  jobId: string;
  status: JobStatus;
  progress: number;
  queuePosition?: number;
  message?: string;
}
