import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-full border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-700",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-none rounded-[22px] border border-dashed border-black/12 bg-white/70 px-4 py-4 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-700",
        className
      )}
      {...props}
    />
  );
}
