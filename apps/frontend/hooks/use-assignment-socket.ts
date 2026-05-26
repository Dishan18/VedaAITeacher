"use client";

import { useEffect } from "react";
import type { JobProgressEvent } from "@vedaai/shared-types";
import { socket } from "@/lib/socket";
import { useAssignmentStore } from "@/stores/assignment-store";

export function useAssignmentSocket(assignmentId?: string) {
  const setProgress = useAssignmentStore((state) => state.setProgress);

  useEffect(() => {
    socket.connect();
    const onProgress = (event: JobProgressEvent) => setProgress(event);
    socket.on("assignment:progress", onProgress);
    if (assignmentId) socket.emit("assignment:join", assignmentId);

    return () => {
      socket.off("assignment:progress", onProgress);
      if (assignmentId) socket.emit("assignment:leave", assignmentId);
    };
  }, [assignmentId, setProgress]);
}
