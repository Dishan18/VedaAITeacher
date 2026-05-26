"use client";

import { create } from "zustand";
import type { AssignmentSummary, JobProgressEvent } from "@vedaai/shared-types";

type State = {
  assignments: AssignmentSummary[];
  activeProgress?: JobProgressEvent;
  setAssignments: (assignments: AssignmentSummary[]) => void;
  removeAssignment: (id: string) => void;
  setProgress: (event: JobProgressEvent) => void;
};

export const useAssignmentStore = create<State>((set) => ({
  assignments: [],
  setAssignments: (assignments) => set({ assignments }),
  removeAssignment: (id) => set((state) => ({ assignments: state.assignments.filter((item) => item.id !== id) })),
  setProgress: (event) => set({ activeProgress: event })
}));
