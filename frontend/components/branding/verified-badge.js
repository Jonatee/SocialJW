"use client";

import { Sparkles } from "lucide-react";

export default function VerifiedBadge({ compact = false, className = "", roleLabel = "Moderator" }) {
  if (compact) {
    return (
      <span
        className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#8ba8c4]/70 bg-[linear-gradient(135deg,#f8fbff_0%,#cfe0f0_42%,#7b97b3_100%)] text-[#17324d] shadow-[0_0_18px_rgba(95,125,155,0.18)] ${className}`}
        title={roleLabel}
        aria-label={roleLabel}
      >
        <Sparkles size={10} className="relative z-10" />
        <span className="pointer-events-none absolute inset-y-0 left-[18%] w-[34%] -skew-x-12 rounded-full bg-white/35 blur-[0.5px]" />
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-[#bcd0e4] bg-[linear-gradient(135deg,#f8fbff_0%,#d6e4f2_40%,#89a4bf_100%)] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#17324d] shadow-[0_0_20px_rgba(95,125,155,0.14)] ${className}`}
      title={roleLabel}
      aria-label={roleLabel}
    >
      <span className="pointer-events-none absolute inset-y-0 left-[-12%] w-[40%] -skew-x-12 bg-white/35 blur-[0.5px]" />
      <Sparkles size={10} className="relative z-10" />
      <span className="relative z-10">{roleLabel}</span>
    </span>
  );
}
