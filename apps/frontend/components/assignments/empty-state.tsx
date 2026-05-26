"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid min-h-[calc(100vh-132px)] place-items-center px-6"
    >
      <div className="max-w-xl text-center">
        <div className="relative mx-auto mb-10 grid h-64 w-64 place-items-center rounded-full bg-white/55">
          <div className="rounded-[26px] bg-white p-8 shadow-xl">
            <div className="h-3 w-16 rounded-full bg-[#0d2436]" />
            <div className="mt-5 space-y-3">
              <div className="h-3 w-28 rounded-full bg-neutral-300" />
              <div className="h-3 w-24 rounded-full bg-neutral-300" />
              <div className="h-3 w-20 rounded-full bg-neutral-300" />
            </div>
          </div>
          <div className="absolute grid h-24 w-24 place-items-center rounded-full border-[10px] border-[#cfc5e6] bg-white/50 text-6xl font-black text-red-500 shadow-xl">
            x
          </div>
          <Sparkles className="absolute bottom-12 left-9 h-8 w-8 text-[#2f7ead]" />
        </div>
        <h1 className="text-2xl font-black">No assignments yet</h1>
        <p className="mx-auto mt-4 max-w-lg text-balance text-neutral-500">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics,
          define marking criteria, and let AI assist with grading.
        </p>
        <Button asChild className="mt-10">
          <Link href="/create">
            <Plus className="h-5 w-5" /> Create Your First Assignment
          </Link>
        </Button>
      </div>
    </motion.section>
  );
}
