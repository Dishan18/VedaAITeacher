import type { AssignmentSummary } from "@vedaai/shared-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store"
  });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message ?? "Request failed");
  return response.json() as Promise<T>;
}

export function pdfUrl(path?: string) {
  if (!path) return "#";
  return `${API_URL}/${path.replaceAll("\\", "/")}`;
}

export async function fetchAssignments(search = "", status = "all") {
  return api<{ assignments: AssignmentSummary[]; totalCount: number }>(
    `/assignments?search=${encodeURIComponent(search)}&status=${status}`
  );
}
