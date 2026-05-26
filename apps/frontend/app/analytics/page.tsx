"use client";

import { BarChart3, Clock, FileText, Sparkles, TrendingUp } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

const cards = [
  ["Assignments", "128", FileText],
  ["Avg. Generation", "42s", Clock],
  ["AI Balance Score", "94%", Sparkles],
  ["Completion", "+18%", TrendingUp]
] as const;

export default function AnalyticsPage() {
  return (
    <main className="flex min-h-screen bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),rgba(218,218,218,0.92)_45%,rgba(199,199,199,0.9))]">
      <Sidebar />
      <section className="min-w-0 flex-1 pb-32 lg:pr-4">
        <Topbar title="Analytics" />
        <div className="mx-auto max-w-[1100px] px-4 py-6 lg:px-0">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-[#ff642a]" />
            <h1 className="text-2xl font-black">Analytics</h1>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(([label, value, Icon]) => (
              <div key={label} className="rounded-[22px] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                <Icon className="h-6 w-6 text-[#ff642a]" />
                <p className="mt-6 text-3xl font-black">{value}</p>
                <p className="text-sm text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[24px] bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
              <h2 className="font-black">Difficulty Distribution</h2>
              <div className="mt-8 flex h-64 items-end gap-4">
                {[62, 86, 44, 71, 53, 92].map((height, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-3">
                    <div className="w-full rounded-t-xl bg-[#222]" style={{ height: `${height}%` }} />
                    <span className="text-xs text-neutral-500">W{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[24px] bg-[#222] p-6 text-white shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
              <h2 className="font-black">Template Performance</h2>
              <div className="mt-6 space-y-4">
                {["Science Quiz", "CBSE Exam Paper", "Numerical Practice", "Reading Check"].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl bg-white/8 p-4">
                    <span>{item}</span>
                    <b>{96 - index * 7}%</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <MobileNav />
    </main>
  );
}
