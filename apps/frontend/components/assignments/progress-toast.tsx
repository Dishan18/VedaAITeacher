"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAssignmentStore } from "@/stores/assignment-store";

export function ProgressToast() {
  const event = useAssignmentStore((state) => state.activeProgress);
  const visible = event && event.status !== "completed";

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed bottom-28 left-1/2 z-40 w-[min(520px,calc(100vw-32px))] -translate-x-1/2 rounded-2xl bg-[#1c1c1c] p-4 text-white shadow-2xl lg:bottom-8"
        >
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-[#ff7a45]" />
            <div className="min-w-0 flex-1">
              <p className="font-bold capitalize">{event.status.replaceAll("_", " ")}</p>
              <p className="text-sm text-white/65">{event.message}</p>
            </div>
            <span className="text-sm font-bold">{event.progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[#ff7a45] transition-all" style={{ width: `${event.progress}%` }} />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
