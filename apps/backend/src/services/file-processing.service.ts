import fs from "node:fs/promises";
import path from "node:path";
import mammoth from "mammoth";
import pdf from "pdf-parse";
import { createWorker } from "tesseract.js";

type ProcessableFile = {
  originalName: string;
  mimeType: string;
  path?: string;
};

function cleanText(value: string) {
  return value.replace(/\r/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export async function extractTextFromFiles(files: ProcessableFile[]) {
  const chunks: string[] = [];

  for (const file of files) {
    if (!file.path) continue;
    const ext = path.extname(file.originalName).toLowerCase();
    if (file.mimeType === "application/pdf" || ext === ".pdf") {
      const data = await pdf(await fs.readFile(file.path));
      chunks.push(data.text);
      continue;
    }

    if (file.mimeType.includes("word") || ext === ".docx") {
      const data = await mammoth.extractRawText({ path: file.path });
      chunks.push(data.value);
      continue;
    }

    if (file.mimeType.startsWith("image/")) {
      const worker = await createWorker("eng");
      const result = await worker.recognize(file.path);
      await worker.terminate();
      chunks.push(result.data.text);
      continue;
    }

    chunks.push(await fs.readFile(file.path, "utf8"));
  }

  return cleanText(chunks.join("\n\n"));
}
