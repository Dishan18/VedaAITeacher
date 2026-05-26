"use client";

import { BarChart3, BookOpen, FileText, Grid2X2, Library, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAssignmentStore } from "@/stores/assignment-store";

const nav = [
  { label: "Home", icon: Grid2X2, href: "/" },
  { label: "My Groups", icon: BookOpen, href: "/" },
  { label: "Assignments", icon: FileText, href: "/", active: true },
  { label: "AI Teacher's Toolkit", icon: Sparkles, href: "/create" },
  { label: "My Library", icon: Library, href: "/" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" }
];

export function Sidebar() {
  const assignmentCount = useAssignmentStore((state) => state.assignmentCount);

  return (
    <aside className="hidden w-[292px] shrink-0 p-4 lg:block">
      <div className="glass flex h-[calc(100vh-32px)] min-h-[700px] flex-col rounded-[24px] p-8">
        <Logo />
        <Button asChild className="mt-16 h-12 whitespace-nowrap border-4 border-[#ff7854] px-5 text-[13px]">
          <Link href="/create">
            <Sparkles className="h-4 w-4" /> Create Assignment
          </Link>
        </Button>
        <nav className="mt-14 space-y-2">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg px-4 text-sm text-neutral-500 transition hover:bg-neutral-100",
                item.active && "bg-neutral-100 font-semibold text-[#242424]"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="min-w-0 flex-1">{item.label}</span>
              {item.label === "Assignments" && assignmentCount > 0 ? (
                <span className="rounded-full bg-[#ff642a] px-3 py-0.5 text-xs text-white">{assignmentCount}</span>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Link className="mb-5 flex items-center gap-3 px-4 text-sm text-neutral-500" href="/">
            <Settings className="h-5 w-5" /> Settings
          </Link>
          <div className="flex items-center gap-4 rounded-2xl bg-neutral-100 p-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#ffd4bf] text-2xl">JD</div>
            <div>
              <p className="font-bold">Delhi Public School</p>
              <p className="text-sm text-neutral-500">Bokaro Steel City</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
