import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { GeneratedPaper } from "@vedaai/shared-types";
import { env } from "../config/env.js";

export async function createPaperPdf(paper: GeneratedPaper, assignmentId: string) {
  await fs.mkdir(env.GENERATED_DIR, { recursive: true });
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const margin = 54;
  let page = pdf.addPage([595.28, 841.89]);
  let y = 790;

  const write = (text: string, size = 11, isBold = false) => {
    const lineHeight = size + 7;
    if (y < 70) {
      page.drawText("VedaAI", { x: margin, y: 34, size: 9, font, color: rgb(0.45, 0.45, 0.45) });
      page = pdf.addPage([595.28, 841.89]);
      y = 790;
    }
    page.drawText(text.slice(0, 105), { x: margin, y, size, font: isBold ? bold : font });
    y -= lineHeight;
  };

  page.drawText(paper.schoolName, { x: margin, y, size: 16, font: bold });
  y -= 22;
  page.drawText(`Subject: ${paper.subject}`, { x: margin, y, size: 11, font });
  page.drawText(`Maximum Marks: ${paper.maximumMarks}`, { x: 405, y, size: 11, font });
  y -= 16;
  page.drawText(`Class: ${paper.class}`, { x: margin, y, size: 11, font });
  page.drawText(`Time Allowed: ${paper.timeAllowedMinutes} minutes`, { x: 405, y, size: 11, font });
  y -= 26;
  write("Name: __________________    Roll Number: __________________    Section: ______", 10);
  y -= 8;

  paper.sections.forEach((section) => {
    write(section.title, 13, true);
    write(section.instruction, 10);
    section.questions.forEach((question, index) => {
      write(`${index + 1}. [${question.difficulty}] ${question.question} [${question.marks} Marks]`, 10);
    });
    y -= 8;
  });

  write("End of Question Paper", 10, true);
  y -= 18;
  write("Answer Key:", 12, true);
  paper.sections.flatMap((s) => s.questions).forEach((question, index) => {
    write(`${index + 1}. ${question.answer}`, 9);
  });

  const bytes = await pdf.save();
  const outputPath = path.join(env.GENERATED_DIR, `${assignmentId}.pdf`);
  await fs.writeFile(outputPath, bytes);
  return outputPath;
}
