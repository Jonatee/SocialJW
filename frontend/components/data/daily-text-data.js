"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";
import SquareAvatar from "@/components/branding/square-avatar";
import DiscussionResponseComposer from "@/components/discussions/discussion-response-composer";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { formatMemberName } from "@/lib/community";
import useAuthStore from "@/stores/auth-store";
import { Trash2 } from "lucide-react";

export default function DailyTextData() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [commentPendingDelete, setCommentPendingDelete] = useState(null);
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
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      await api.delete(`/comments/${commentId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["daily-text-page"] });
      await queryClient.invalidateQueries({ queryKey: ["discussion"] });
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
  const publishedDateLabel = latest.publishedDate
    ? new Date(latest.publishedDate).toLocaleDateString("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "Date not available";

  function handleDeleteComment(commentId) {
    if (deleteCommentMutation.isPending) {
      return;
    }
    setCommentPendingDelete(commentId);
  }

  return (
    <div className="space-y-4">
      <ConfirmDialog
        open={Boolean(commentPendingDelete)}
        title="Delete response?"
        description="This will remove your response from the daily discussion."
        confirmLabel="Delete"
        destructive
        loading={deleteCommentMutation.isPending}
        onClose={() => setCommentPendingDelete(null)}
        onConfirm={() =>
          deleteCommentMutation.mutate(commentPendingDelete, {
            onSuccess: async () => {
              setCommentPendingDelete(null);
              await queryClient.invalidateQueries({ queryKey: ["daily-text-page"] });
            }
          })
        }
      />
      <section className="panel p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.18em] text-muted">
          <span>{latest.scripture}</span>
          <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
          <span>{publishedDateLabel}</span>
        </div>
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
                    <div className="flex items-start justify-between gap-3">
                      <div className="editorial-title text-sm font-bold text-ink">
                        {formatMemberName(comment.author, comment.author?.profile)}
                      </div>
                      {currentUser?.id === comment.author?.id ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="inline-flex items-center gap-2 text-xs text-muted transition hover:text-[#B91C1C]"
                        >
                          <Trash2 size={14} />
                          <span>{deleteCommentMutation.isPending ? "Deleting..." : "Delete"}</span>
                        </button>
                      ) : null}
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
