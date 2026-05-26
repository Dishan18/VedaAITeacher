import type { GeneratedPaper, QuestionConfigRow } from "@vedaai/shared-types";
import { AssignmentModel } from "../models/assignment.model.js";
import { GeneratedPaperModel } from "../models/generated-paper.model.js";
import { createPaperPdf } from "./pdf.service.js";

const electricityConfig: QuestionConfigRow[] = [
  { id: "mcq", type: "MCQ", count: 4, marks: 1 },
  { id: "short", type: "Short Questions", count: 5, marks: 2 },
  { id: "numerical", type: "Numerical Problems", count: 2, marks: 3 }
];

const grammarConfig: QuestionConfigRow[] = [
  { id: "mcq", type: "MCQ", count: 5, marks: 1 },
  { id: "short", type: "Short Questions", count: 4, marks: 2 },
  { id: "long", type: "Long Questions", count: 1, marks: 7 }
];

const electricityPaper: GeneratedPaper = {
  title: "Quiz on Electricity",
  subject: "Science",
  class: "8th",
  schoolName: "Delhi Public School, Sector-4, Bokaro",
  timeAllowedMinutes: 45,
  maximumMarks: 20,
  sections: [
    {
      title: "Section A",
      instruction: "Attempt all questions. Each question carries the marks shown.",
      questions: [
        {
          question: "Why are copper and aluminium commonly used for electrical wiring?",
          difficulty: "easy",
          marks: 2,
          answer: "They are good conductors, flexible enough for wiring, and comparatively affordable."
        },
        {
          question: "Explain the difference between conductors and insulators with one example each.",
          difficulty: "easy",
          marks: 2,
          answer: "Conductors allow electric current to pass, such as copper. Insulators resist current, such as rubber."
        },
        {
          question: "A bulb is connected to a cell but does not glow. List two possible reasons.",
          difficulty: "moderate",
          marks: 2,
          answer: "The circuit may be open, the bulb may be fused, the cell may be weak, or wires may be loose."
        },
        {
          question: "Define electroplating and mention one practical use.",
          difficulty: "moderate",
          marks: 2,
          answer: "Electroplating deposits a thin metal layer using electricity. It is used to prevent corrosion or improve appearance."
        },
        {
          question: "A wire carries 2 A current for 5 minutes. How much charge flows through it?",
          difficulty: "challenging",
          marks: 3,
          answer: "Charge = current x time = 2 x 300 = 600 coulombs."
        }
      ]
    }
  ]
};

const grammarPaper: GeneratedPaper = {
  title: "English Grammar Practice",
  subject: "English",
  class: "6th",
  schoolName: "Delhi Public School, Sector-4, Bokaro",
  timeAllowedMinutes: 40,
  maximumMarks: 20,
  sections: [
    {
      title: "Section A",
      instruction: "Read each question carefully and answer in complete sentences where required.",
      questions: [
        {
          question: "Identify the adjective in the sentence: The bright moon lit the quiet street.",
          difficulty: "easy",
          marks: 1,
          answer: "The adjectives are bright and quiet."
        },
        {
          question: "Change the sentence to past tense: She writes a letter to her friend.",
          difficulty: "easy",
          marks: 1,
          answer: "She wrote a letter to her friend."
        },
        {
          question: "Write two sentences using conjunctions to join related ideas.",
          difficulty: "moderate",
          marks: 2,
          answer: "Example: I wanted to play, but it started raining. She studied hard because the test was important."
        },
        {
          question: "Explain the difference between a phrase and a clause with examples.",
          difficulty: "moderate",
          marks: 4,
          answer: "A phrase is a group of words without a subject-verb pair. A clause has a subject and verb."
        },
        {
          question: "Write a short paragraph on discipline using at least three adjectives and two conjunctions.",
          difficulty: "challenging",
          marks: 7,
          answer: "A strong answer should be coherent, include descriptive adjectives, and use conjunctions correctly."
        }
      ]
    }
  ]
};

export async function ensureDemoAssignments(userId: string) {
  const existing = await AssignmentModel.countDocuments({ userId });
  if (existing > 0) return;

  const examples = [
    {
      title: "Quiz on Electricity",
      dueDate: new Date("2026-06-21"),
      questionConfig: electricityConfig,
      instructions: "Create a balanced electricity quiz for middle school learners.",
      totalQuestions: 11,
      totalMarks: 20,
      paper: electricityPaper
    },
    {
      title: "English Grammar Practice",
      dueDate: new Date("2026-06-28"),
      questionConfig: grammarConfig,
      instructions: "Focus on adjectives, tense, conjunctions, phrases, and clauses.",
      totalQuestions: 10,
      totalMarks: 20,
      paper: grammarPaper
    }
  ];

  for (const example of examples) {
    const assignment = await AssignmentModel.create({
      userId,
      title: example.title,
      dueDate: example.dueDate,
      questionConfig: example.questionConfig,
      instructions: example.instructions,
      status: "completed",
      totalQuestions: example.totalQuestions,
      totalMarks: example.totalMarks
    });
    const pdfPath = await createPaperPdf(example.paper, assignment.id);
    const generated = await GeneratedPaperModel.create({
      assignmentId: assignment.id,
      paper: example.paper,
      pdfPath
    });
    assignment.resultPaperId = generated.id;
    assignment.pdfPath = pdfPath;
    await assignment.save();
  }
}
