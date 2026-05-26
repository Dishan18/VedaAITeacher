import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { env } from "../config/env.js";
import type { JobProgressEvent } from "@vedaai/shared-types";

let io: Server | undefined;

export function initRealtime(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("assignment:join", (assignmentId: string) => socket.join(`assignment:${assignmentId}`));
    socket.on("assignment:leave", (assignmentId: string) => socket.leave(`assignment:${assignmentId}`));
  });

  return io;
}

export function emitProgress(event: JobProgressEvent) {
  io?.to(`assignment:${event.assignmentId}`).emit("assignment:progress", event);
  io?.emit("queue:update", event);
}
