"use client";

import { BookOpen, FileText, Grid2X2, Library, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

export function MobileNav() {
  return (
    <>
      <Link
        href="/create"
        className="fixed bottom-28 right-6 z-30 grid h-14 w-14 place-items-center rounded-full bg-white text-[#ff642a] shadow-2xl lg:hidden"
        aria-label="Create assignment"
      >
        <Plus className="h-7 w-7" />
      </Link>
      <nav className="fixed bottom-4 left-4 right-4 z-30 grid grid-cols-4 rounded-[22px] bg-[#151515] px-4 py-4 text-[11px] text-neutral-500 shadow-2xl lg:hidden">
        {[
          ["Home", Grid2X2],
          ["Assignments", FileText],
          ["Library", Library],
          ["AI Toolkit", Sparkles]
        ].map(([label, Icon], index) => (
          <Link key={String(label)} href={index === 1 ? "/" : "#"} className="flex flex-col items-center gap-1">
            <Icon className={index === 1 ? "h-5 w-5 text-white" : "h-5 w-5"} />
            <span className={index === 1 ? "font-bold text-white" : ""}>{String(label)}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
