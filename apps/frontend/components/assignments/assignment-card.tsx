"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Copy, Eye, MoreVertical, RefreshCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import type { AssignmentSummary } from "@vedaai/shared-types";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useAssignmentStore } from "@/stores/assignment-store";

export function AssignmentCard({ assignment }: { assignment: AssignmentSummary }) {
  const removeAssignment = useAssignmentStore((state) => state.removeAssignment);

  async function deleteAssignment() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/assignments/${assignment.id}`, {
      method: "DELETE"
    });
    removeAssignment(assignment.id);
  }

  return (
    <article className="relative min-h-36 rounded-[22px] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_58px_rgba(0,0,0,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/assignments/${assignment.id}`} className="text-xl font-black underline decoration-neutral-400">
          {assignment.title}
        </Link>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="rounded-full p-1 hover:bg-neutral-100">
            <MoreVertical className="h-5 w-5" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="z-40 min-w-44 rounded-xl bg-white p-2 shadow-2xl">
            <DropdownMenu.Item asChild className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-neutral-100">
              <Link href={`/assignments/${assignment.id}`}>
                <Eye className="h-4 w-4" /> View Assignment
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-neutral-100"
              onSelect={() => api(`/assignments/${assignment.id}/duplicate`, { method: "POST" })}
            >
              <Copy className="h-4 w-4" /> Duplicate
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none hover:bg-neutral-100"
              onSelect={() => api(`/assignments/${assignment.id}/regenerate`, { method: "POST" })}
            >
              <RefreshCcw className="h-4 w-4" /> Regenerate
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50"
              onSelect={deleteAssignment}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="mt-12 flex flex-wrap justify-between gap-3 text-sm">
        <span>
          <b>Assigned on :</b> {formatDate(assignment.assignedOn)}
        </span>
        <span>
          <b>Due :</b> {formatDate(assignment.dueDate)}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
        <span>{assignment.totalQuestions} questions</span>
        <span>•</span>
        <span>{assignment.totalMarks} marks</span>
        <span className="ml-auto rounded-full bg-neutral-100 px-3 py-1 capitalize">{assignment.status.replaceAll("_", " ")}</span>
      </div>
    </article>
  );
}
