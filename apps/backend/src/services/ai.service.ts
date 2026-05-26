import OpenAI from "openai";
import type { CreateAssignmentInput, Difficulty, GeneratedPaper } from "@vedaai/shared-types";
import { env } from "../config/env.js";

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : undefined;

function buildPrompt(input: CreateAssignmentInput, extractedText: string) {
  const config = input.questionConfig
    .map((row) => `${row.count} ${row.type} questions worth ${row.marks} marks each`)
    .join("; ");

  return [
    "Create a balanced school assessment paper as strict JSON only.",
    "Do not include markdown, prose, comments, or raw model text outside JSON.",
    "Difficulty distribution should be roughly 35% easy, 45% moderate, 20% challenging.",
    `Question distribution: ${config}.`,
    `Due date: ${input.dueDate}. Time allowed: ${input.timeAllowedMinutes ?? 45} minutes.`,
    `Teacher instructions: ${input.instructions || "None"}.`,
    `Source material:\n${extractedText || input.manualText || "Use the teacher instructions as the source."}`,
    "Required schema: { title, subject, class, schoolName, timeAllowedMinutes, maximumMarks, sections: [{ title, instruction, questions: [{ question, difficulty, marks, answer, type }] }] }"
  ].join("\n\n");
}

function fallbackPaper(input: CreateAssignmentInput, extractedText: string): GeneratedPaper {
  const sourceHint = (extractedText || input.manualText || input.instructions || "the provided lesson").slice(0, 90);
  const questions = input.questionConfig.flatMap((row) =>
    Array.from({ length: row.count }, (_, index) => ({
      question: `${row.type}: Explain concept ${index + 1} from ${sourceHint}.`,
      difficulty: (index % 5 === 0 ? "challenging" : index % 2 === 0 ? "easy" : "moderate") as Difficulty,
      marks: row.marks,
      answer: `A complete answer should define the concept, connect it to the source material, and include a relevant classroom example.`,
      type: row.type
    }))
  );

  const maximumMarks = questions.reduce((sum, question) => sum + question.marks, 0);
  return {
    title: input.title || "AI Generated Assessment",
    subject: "English",
    class: "5th",
    schoolName: "Delhi Public School, Sector-4, Bokaro",
    timeAllowedMinutes: input.timeAllowedMinutes ?? 45,
    maximumMarks,
    sections: [
      {
        title: "Section A",
        instruction: "All questions are compulsory unless stated otherwise.",
        questions
      }
    ]
  };
}

export async function generateAssessment(input: CreateAssignmentInput, extractedText: string): Promise<GeneratedPaper> {
  if (!client) return fallbackPaper(input, extractedText);

  const response = await client.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.35,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an expert assessment designer. Return only valid JSON matching the requested schema. Never render raw LLM text."
      },
      { role: "user", content: buildPrompt(input, extractedText) }
    ]
  });

  const content = response.choices[0]?.message.content;
  if (!content) throw new Error("AI returned an empty response");
  return JSON.parse(content) as GeneratedPaper;
}
