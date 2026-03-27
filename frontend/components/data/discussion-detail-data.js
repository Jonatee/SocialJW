"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import SquareAvatar from "@/components/branding/square-avatar";
import { formatMemberName } from "@/lib/community";
import DiscussionResponseComposer from "@/components/discussions/discussion-response-composer";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import useAuthStore from "@/stores/auth-store";
import { Trash2 } from "lucide-react";

export default function DiscussionDetailData({ discussionId }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [discussionDeleteOpen, setDiscussionDeleteOpen] = useState(false);
  const [commentPendingDelete, setCommentPendingDelete] = useState(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["discussion", discussionId],
    queryFn: async () => {
      const response = await api.get(`/discussions/${discussionId}`);
      return response.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/discussions/${discussionId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["discussion", discussionId] });
      await queryClient.invalidateQueries({ queryKey: ["discussions"] });
      router.push("/discussions");
    }
  });
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      await api.delete(`/comments/${commentId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["discussion", discussionId] });
      await queryClient.invalidateQueries({ queryKey: ["daily-text-page"] });
    }
  });

  if (isLoading) {
    return <div className="panel p-6 text-sm text-muted">Loading discussion...</div>;
  }

  if (error || !data?.thread) {
    return <div className="panel p-6 text-sm text-accent">Failed to load this discussion.</div>;
  }

  const thread = data.thread;
  const canDelete =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "moderator" || currentUser.id === thread.authorId);

  function handleDelete() {
    if (!canDelete || deleteMutation.isPending) {
      return;
    }
    setDiscussionDeleteOpen(true);
  }

  function handleDeleteComment(commentId) {
    if (deleteCommentMutation.isPending) {
      return;
    }
    setCommentPendingDelete(commentId);
  }

  return (
    <div className="space-y-4">
      <ConfirmDialog
        open={discussionDeleteOpen}
        title="Delete discussion?"
        description="This will remove the discussion and its visible responses from the page."
        confirmLabel="Delete discussion"
        destructive
        loading={deleteMutation.isPending}
        onClose={() => setDiscussionDeleteOpen(false)}
        onConfirm={() =>
          deleteMutation.mutate(undefined, {
            onSuccess: () => {
              setDiscussionDeleteOpen(false);
            }
          })
        }
      />
      <ConfirmDialog
        open={Boolean(commentPendingDelete)}
        title="Delete response?"
        description="This will remove your response from the discussion."
        confirmLabel="Delete"
        destructive
        loading={deleteCommentMutation.isPending}
        onClose={() => setCommentPendingDelete(null)}
        onConfirm={() =>
          deleteCommentMutation.mutate(commentPendingDelete, {
            onSuccess: async () => {
              setCommentPendingDelete(null);
              await queryClient.invalidateQueries({ queryKey: ["discussion", discussionId] });
            }
          })
        }
      />
      <section className="panel p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="editorial-title text-2xl font-black text-ink">{thread.title}</div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
              <span>{formatMemberName(thread.author, thread.author?.profile)}</span>
              <span>{thread.scriptureReferences?.join(", ") || "No scripture references added"}</span>
            </div>
          </div>
          {canDelete ? (
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 text-[#B91C1C] hover:bg-[#FEE2E2] hover:text-[#991B1B]"
              loading={deleteMutation.isPending}
              onClick={handleDelete}
            >
              Delete discussion
            </Button>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-7 text-[#29445e]">{thread.prompt}</p>
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
        {!data.comments?.length ? (
          <div className="panel p-6 text-sm text-muted">No responses have been added yet.</div>
        ) : null}
      </section>
    </div>
  );
}
