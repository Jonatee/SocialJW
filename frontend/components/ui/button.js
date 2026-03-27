"use client";

import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", loading = false, children, disabled, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "editorial-title bg-accent text-white shadow-[0_12px_24px_rgba(59,130,246,0.22)] hover:bg-[#2563eb]",
        variant === "secondary" &&
          "border border-border bg-panel text-ink hover:bg-[#EEF4FA]",
        variant === "ghost" && "text-muted hover:bg-[#EEF4FA] hover:text-accentDark",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}
      {children}
    </button>
  );
}
