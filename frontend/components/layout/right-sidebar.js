"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import SquareAvatar from "@/components/branding/square-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMemberName } from "@/lib/community";

function SidebarSectionSkeleton({ lines = 4 }) {
  return (
    <section className="panel p-5">
      <Skeleton className="mb-4 h-4 w-24" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </section>
  );
}

export default function RightSidebar() {
  const tagsQuery = useQuery({
    queryKey: ["sidebar-tags"],
    queryFn: async () => {
      const response = await api.get("/search/tags?q=");
      return response.data.data || [];
    }
  });

  const usersQuery = useQuery({
    queryKey: ["sidebar-users"],
    queryFn: async () => {
      const response = await api.get("/search/users?q=");
      return response.data.data || [];
    }
  });

  return (
    <aside className="space-y-6">
      {tagsQuery.isLoading ? (
        <SidebarSectionSkeleton lines={4} />
      ) : (
        <section className="panel p-5">
          <div className="editorial-title mb-4 text-xs font-bold text-muted">Discussion Topics</div>
          <div className="space-y-3">
            {(tagsQuery.data || []).slice(0, 5).map((tag) => (
              <Link
                key={tag.id}
                href={`/search?q=${encodeURIComponent(tag.normalizedTag || tag.tag)}`}
                className="block rounded-xl bg-[#f7fbff] px-4 py-3 text-sm text-ink transition hover:bg-[#edf4fb]"
              >
                <div className="font-semibold">#{tag.tag || tag.normalizedTag}</div>
                <div className="mt-1 text-xs text-muted">{tag.usageCount || 0} discussions</div>
              </Link>
            ))}
            {!tagsQuery.data?.length ? (
              <div className="rounded-xl bg-[#f7fbff] px-4 py-3 text-sm text-muted">No active topics yet.</div>
            ) : null}
          </div>
        </section>
      )}

      {usersQuery.isLoading ? (
        <SidebarSectionSkeleton lines={3} />
      ) : (
        <section className="panel p-5">
          <div className="editorial-title mb-4 text-xs font-bold text-muted">Connected Brothers and Sisters</div>
          <div className="space-y-4">
            {(usersQuery.data || []).slice(0, 4).map((user) => {
              const displayName = formatMemberName(user, user.profile);
              return (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-[#edf4fb]"
                >
                  <SquareAvatar initials={displayName.slice(0, 2).toUpperCase()} size="sm" />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-ink">{displayName}</div>
                    <div className="text-xs text-muted">@{user.username}</div>
                  </div>
                </Link>
              );
            })}
            {!usersQuery.data?.length ? (
              <div className="text-sm text-muted">No suggestions available yet.</div>
            ) : null}
          </div>
        </section>
      )}
    </aside>
  );
}
