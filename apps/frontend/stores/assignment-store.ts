"use client";

import { create } from "zustand";
import type { AssignmentSummary, JobProgressEvent } from "@vedaai/shared-types";

type State = {
  assignments: AssignmentSummary[];
  assignmentCount: number;
  activeProgress?: JobProgressEvent;
  setAssignments: (assignments: AssignmentSummary[], totalCount?: number) => void;
  removeAssignment: (id: string) => void;
  setProgress: (event: JobProgressEvent) => void;
};

export const useAssignmentStore = create<State>((set) => ({
  assignments: [],
  assignmentCount: 0,
  setAssignments: (assignments, totalCount) => set({ assignments, assignmentCount: totalCount ?? assignments.length }),
  removeAssignment: (id) =>
    set((state) => ({
      assignments: state.assignments.filter((item) => item.id !== id),
      assignmentCount: Math.max(0, state.assignmentCount - 1)
    })),
  setProgress: (event) => set({ activeProgress: event })
}));
