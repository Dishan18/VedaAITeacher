"use client";

import { Bell, ChevronDown, Grid2X2, Menu, MoveLeft } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";

export function Topbar({ title = "Assignment", centered = false }: { title?: string; centered?: boolean }) {
  return (
    <header className="sticky top-0 z-20 px-4 pt-4 lg:px-0">
      <div className="glass mx-auto flex h-16 max-w-[1200px] items-center justify-between rounded-2xl px-4 lg:px-6">
        <div className="hidden items-center gap-4 lg:flex">
          <Button variant="secondary" size="icon">
            <MoveLeft className="h-5 w-5" />
          </Button>
          <Grid2X2 className="h-5 w-5 text-neutral-400" />
          <span className="font-semibold text-neutral-400">{title}</span>
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          <Logo />
        </div>
        {centered ? <p className="absolute left-1/2 hidden -translate-x-1/2 font-bold sm:block">{title}</p> : null}
        <div className="flex items-center gap-3">
          <button className="relative grid h-11 w-11 place-items-center rounded-full bg-white/70">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ff642a]" />
          </button>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#ffd4bf] text-xs font-bold">JD</div>
            <span className="font-bold">John Doe</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <Button className="lg:hidden" variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
