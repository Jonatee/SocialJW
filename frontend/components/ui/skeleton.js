import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return <div className={cn("skeleton-shimmer rounded-md bg-[#E8EEF5]", className)} />;
}
