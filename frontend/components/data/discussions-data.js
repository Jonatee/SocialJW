"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatMemberName } from "@/lib/community";

export default function DiscussionsData({ questionOnly = false }) {
  const { data, isLoading, error } = useQuery({
    queryKey: [questionOnly ? "questions" : "discussions"],
    queryFn: async () => {
      const response = await api.get("/discussions");
      return response.data.data || [];
    }
  });

  if (isLoading) {
    return <div className="panel p-6 text-sm text-muted">Loading discussions...</div>;
  }

  if (error) {
    return <div className="panel p-6 text-sm text-accent">Failed to load discussions.</div>;
  }

  const items = (data || []).filter((item) => (questionOnly ? !item.isDailyDiscussion : true));

  if (!items.length) {
    return (
      <div className="panel p-6 text-sm text-muted">
        {questionOnly
          ? "No question threads are available yet. Use the call to action above to ask one."
          : "No discussions are available yet. Use the call to action above to start one."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/discussions/${item.id}`}
          className="panel block p-5 transition hover:bg-[#f7fbff]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="editorial-title text-xl font-bold text-ink">{item.title}</div>
            {item.isPinned ? <span className="rounded-full bg-accent/12 px-3 py-1 text-xs font-semibold text-accent">Pinned</span> : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-[#29445e]">{item.prompt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span>{formatMemberName(item.author, item.author?.profile)}</span>
            <span>{item.commentCount || 0} responses</span>
            <span>{item.scriptureReferences?.join(", ") || "No scripture references added yet"}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
