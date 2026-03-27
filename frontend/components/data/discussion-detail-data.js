"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import SquareAvatar from "@/components/branding/square-avatar";
import { formatMemberName } from "@/lib/community";
import DiscussionResponseComposer from "@/components/discussions/discussion-response-composer";

export default function DiscussionDetailData({ discussionId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["discussion", discussionId],
    queryFn: async () => {
      const response = await api.get(`/discussions/${discussionId}`);
      return response.data.data;
    }
  });

  if (isLoading) {
    return <div className="panel p-6 text-sm text-muted">Loading discussion...</div>;
  }

  if (error || !data?.thread) {
    return <div className="panel p-6 text-sm text-accent">Failed to load this discussion.</div>;
  }

  const thread = data.thread;

  return (
    <div className="space-y-4">
      <section className="panel p-6">
        <div className="editorial-title text-2xl font-black text-ink">{thread.title}</div>
        <p className="mt-3 text-sm leading-7 text-[#29445e]">{thread.prompt}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
          <span>{formatMemberName(thread.author, thread.author?.profile)}</span>
          <span>{thread.scriptureReferences?.join(", ") || "No scripture references added"}</span>
        </div>
      </section>
      <DiscussionResponseComposer discussionId={discussionId} queryKey={["discussion", discussionId]} />
      <section className="space-y-4">
        {(data.comments || []).map((comment) => (
          <article key={comment.id} className="panel p-4">
            <div className="flex gap-3">
              <SquareAvatar
                initials={(
                  comment.author?.profile?.displayName ||
                  comment.author?.usernameDisplay ||
                  comment.author?.username ||
                  "JW"
                )
                  .slice(0, 2)
                  .toUpperCase()}
                src={comment.author?.profile?.avatarMedia?.secureUrl || ""}
                alt={formatMemberName(comment.author, comment.author?.profile)}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="editorial-title text-sm font-bold text-ink">
                  {formatMemberName(comment.author, comment.author?.profile)}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#29445e]">{comment.content}</p>
              </div>
            </div>
          </article>
        ))}
        {!data.comments?.length ? (
          <div className="panel p-6 text-sm text-muted">No responses have been added yet.</div>
        ) : null}
      </section>
    </div>
  );
}
