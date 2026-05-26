import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
};

export function Button({ className, asChild, variant = "primary", size = "md", ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.98] disabled:opacity-50",
        variant === "primary" && "bg-[#1d1d1d] text-white shadow-[inset_0_-8px_18px_rgba(255,255,255,0.08)] hover:bg-black",
        variant === "secondary" && "bg-white text-[#232323] hover:bg-neutral-100",
        variant === "ghost" && "bg-transparent text-[#333] hover:bg-black/5",
        variant === "danger" && "bg-red-50 text-red-600 hover:bg-red-100",
        size === "md" && "h-12 px-6 text-sm",
        size === "sm" && "h-9 px-4 text-xs",
        size === "icon" && "h-11 w-11 p-0",
        className
      )}
      {...props}
    />
  );
}
