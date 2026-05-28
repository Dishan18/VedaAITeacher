import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serverPath = path.join(__dirname, "server.js");
const workerPath = path.join(__dirname, "workers", "assignment.worker.js");

function runProcess(scriptPath: string, name: string) {
  console.log(`[Launcher] Starting ${name} process...`);
  const child = spawn("node", [scriptPath], {
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code) => {
    console.error(`[Launcher] ${name} process exited with code ${code}`);
    process.exit(code ?? 1);
  });

  child.on("error", (err) => {
    console.error(`[Launcher] Failed to start ${name} process:`, err);
    process.exit(1);
  });
}

console.log("[Launcher] Starting VedaAI API Server and background worker in the same container...");
runProcess(serverPath, "API");
runProcess(workerPath, "Worker");
