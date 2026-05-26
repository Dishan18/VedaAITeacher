"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import { AssignmentCard } from "@/components/assignments/assignment-card";
import { EmptyState } from "@/components/assignments/empty-state";
import { ProgressToast } from "@/components/assignments/progress-toast";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchAssignments } from "@/lib/api";
import { useAssignmentSocket } from "@/hooks/use-assignment-socket";
import { useAssignmentStore } from "@/stores/assignment-store";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const assignments = useAssignmentStore((state) => state.assignments);
  const setAssignments = useAssignmentStore((state) => state.setAssignments);
  useAssignmentSocket();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetchAssignments(search, filter)
        .then((data) => setAssignments(data.assignments))
        .catch(() => setAssignments([]))
        .finally(() => setLoading(false));
    }, 220);
    return () => clearTimeout(timer);
  }, [search, filter, setAssignments]);

  const content = useMemo(() => {
    if (loading) {
      return <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-[22px] bg-white/65" />)}</div>;
    }
    if (!assignments.length) return <EmptyState />;
    return <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{assignments.map((item) => <AssignmentCard key={item.id} assignment={item} />)}</div>;
  }, [assignments, loading]);

  return (
    <main className="flex min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),rgba(218,218,218,0.92)_45%,rgba(199,199,199,0.9))]">
      <Sidebar />
      <section className="min-w-0 flex-1 pb-32 lg:pb-6 lg:pr-4">
        <Topbar />
        <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-0">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-full border-4 border-emerald-200 bg-emerald-500" />
                <h1 className="text-2xl font-black">Assignments</h1>
              </div>
              <p className="mt-1 text-sm text-neutral-500">Manage and create assignments for your classes.</p>
            </div>
            <Button asChild className="hidden lg:inline-flex">
              <Link href="/create">
                <Plus className="h-5 w-5" /> Create Assignment
              </Link>
            </Button>
          </div>
          <div className="glass mb-4 grid gap-3 rounded-[20px] p-3 md:grid-cols-[1fr_360px]">
            <label className="flex h-12 items-center gap-2 rounded-full bg-white px-4 text-sm text-neutral-500">
              <Filter className="h-4 w-4" />
              <select className="w-full bg-transparent outline-none" value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">Filter By</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </label>
            <label className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <Input className="pl-12" placeholder="Search Assignment" value={search} onChange={(event) => setSearch(event.target.value)} />
            </label>
          </div>
          {content}
        </div>
      </section>
      <MobileNav />
      <ProgressToast />
    </main>
  );
}
