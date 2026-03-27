"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import SquareAvatar from "@/components/branding/square-avatar";
import VerifiedBadge from "@/components/branding/verified-badge";
import FeedCard from "@/components/feed/feed-card";
import { formatPost } from "@/lib/formatters";
import { SearchSkeleton } from "@/components/loading/screen-skeletons";
import { formatMemberName, hasRoleBadge } from "@/lib/community";

export default function SearchResults({ query }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
      return response.data.data;
    },
    enabled: Boolean(query)
  });

  if (!query) {
    return <div className="panel p-6 text-sm text-muted">Add a search term in the URL, for example `?q=ada`.</div>;
  }

  if (isLoading) {
    return <SearchSkeleton />;
  }

  if (error || !data) {
    return <div className="panel p-6 text-sm text-accent">Search failed.</div>;
  }

  return (
    <div className="space-y-4">
      {(data.topics || []).slice(0, 5).map((topic) => (
        <div key={topic.id} className="panel block p-5">
          <div className="editorial-title text-xs font-bold text-muted">Topic</div>
          <div className="mt-2 text-lg font-bold text-ink">{topic.name}</div>
          <div className="mt-1 text-sm text-muted">{topic.description || topic.category}</div>
        </div>
      ))}
      {(data.discussions || []).slice(0, 5).map((discussion) => (
        <Link key={discussion.id} href={`/discussions/${discussion.id}`} className="panel block p-5 transition hover:bg-[#f7fbff]">
          <div className="editorial-title text-xs font-bold text-muted">Discussion</div>
          <div className="mt-2 text-lg font-bold text-ink">{discussion.title}</div>
          <div className="mt-1 text-sm text-muted">{discussion.prompt}</div>
        </Link>
      ))}
      {(data.tags || []).slice(0, 5).map((tag) => (
        <Link
          key={tag.id}
          href={`/search?q=${encodeURIComponent(tag.normalizedTag || tag.tag)}`}
          className="panel block p-5 transition hover:bg-[#f7fbff]"
        >
          <div className="editorial-title text-xs font-bold text-muted">Tag</div>
          <div className="mt-2 text-lg font-bold text-ink">#{tag.tag || tag.normalizedTag}</div>
          <div className="mt-1 text-sm text-muted">{tag.usageCount || 0} posts</div>
        </Link>
      ))}
      {(data.users || []).map((user) => (
        <Link key={user.id} href={`/profile/${user.username}`} className="panel block p-5 transition hover:bg-[#f7fbff]">
          <div className="flex items-center gap-4">
            <SquareAvatar
              initials={(user.usernameDisplay || user.username).slice(0, 2).toUpperCase()}
              src={user.profile?.avatarMedia?.secureUrl || ""}
              alt={formatMemberName(user, user.profile)}
            />
            <div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-ink">{formatMemberName(user, user.profile)}</div>
                {hasRoleBadge(user) ? <VerifiedBadge compact roleLabel={user.role === "admin" ? "Admin" : "Moderator"} /> : null}
              </div>
              <div className="text-sm text-muted">@{user.username}</div>
            </div>
          </div>
        </Link>
      ))}
      {(data.posts || []).map((post) => (
        <FeedCard key={post.id} post={formatPost(post)} />
      ))}
    </div>
  );
}
