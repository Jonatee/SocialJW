"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";
import SquareAvatar from "@/components/branding/square-avatar";
import DiscussionResponseComposer from "@/components/discussions/discussion-response-composer";
import { formatMemberName } from "@/lib/community";

export default function DailyTextData() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["daily-text-page"],
    queryFn: async () => {
      const [dailyTextResponse, discussionsResponse] = await Promise.all([
        api.get("/daily-text"),
        api.get("/discussions")
      ]);

      const dailyTexts = dailyTextResponse.data.data || [];
      const discussions = discussionsResponse.data.data || [];
      const activeDiscussionSummary = discussions.find((item) => item.isDailyDiscussion) || null;
      let activeDiscussion = null;

      if (activeDiscussionSummary?.id) {
        const detailResponse = await api.get(`/discussions/${activeDiscussionSummary.id}`);
        activeDiscussion = detailResponse.data.data || null;
      }

      return {
        dailyTexts,
        activeDiscussion: activeDiscussion?.thread || activeDiscussionSummary,
        activeComments: activeDiscussion?.comments || []
      };
    }
  });

  if (isLoading) {
    return <div className="panel p-6 text-sm text-muted">Loading daily discussion...</div>;
  }

  if (error) {
    return <div className="panel p-6 text-sm text-accent">Failed to load the daily discussion.</div>;
  }

  const [latest] = data?.dailyTexts || [];
  if (!latest) {
    return <div className="panel p-6 text-sm text-muted">No daily discussion has been published yet.</div>;
  }

  const activeDiscussion = data?.activeDiscussion || null;
  const activeComments = data?.activeComments || [];

  return (
    <div className="space-y-4">
      <section className="panel p-6">
        <div className="text-xs uppercase tracking-[0.18em] text-muted">{latest.scripture}</div>
        <div className="editorial-title mt-2 text-2xl font-black text-ink">{latest.title}</div>
        <p className="mt-4 text-sm leading-7 text-[#29445e]">{latest.bodyText}</p>
        <div className="mt-6 rounded-[18px] bg-[#f7fbff] p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-muted">Discussion Question</div>
          <p className="mt-2 text-sm leading-6 text-ink">{latest.discussionQuestion}</p>
        </div>
      </section>

      {activeDiscussion ? (
        <>
          <DiscussionResponseComposer
            discussionId={activeDiscussion.id}
            queryKey={["daily-text-page"]}
          />
          <section className="space-y-4">
            {activeComments.map((comment) => (
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
            {!activeComments.length ? (
              <div className="panel p-6 text-sm text-muted">No responses have been added to the daily discussion yet.</div>
            ) : null}
          </section>
          <div className="text-right">
            <Link href={`/discussions/${activeDiscussion.id}`} className="text-sm font-semibold text-accent">
              Open full daily discussion
            </Link>
          </div>
        </>
      ) : (
        <div className="panel p-6 text-sm text-muted">
          No linked daily discussion thread is available yet.
        </div>
      )}
    </div>
  );
}
