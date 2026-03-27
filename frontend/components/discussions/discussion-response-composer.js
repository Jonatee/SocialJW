"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import SquareAvatar from "@/components/branding/square-avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getLoginRedirectPath } from "@/lib/auth-redirect";
import useAuthStore from "@/stores/auth-store";
import { formatMemberName } from "@/lib/community";

export default function DiscussionResponseComposer({ discussionId, queryKey = ["discussion", discussionId] }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);
  const form = useForm({
    defaultValues: {
      content: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (values) => {
      const response = await api.post(`/discussions/${discussionId}/comments`, values);
      return response.data.data;
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["daily-text"] });
      queryClient.invalidateQueries({ queryKey: ["discussions"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    }
  });

  if (!currentUser) {
    return (
      <div className="panel p-4">
        <div className="editorial-title mb-2 text-xs font-bold text-muted">Add a Response</div>
        <p className="text-sm text-muted">Log in to respond to this discussion.</p>
        <div className="mt-4">
          <Link
            href={getLoginRedirectPath(pathname || `/discussions/${discussionId}`)}
            className="inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Log in to respond
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="panel p-4">
      <div className="flex gap-3">
        <SquareAvatar
          initials={(currentUser?.profile?.displayName || currentUser?.username || "JW").slice(0, 2).toUpperCase()}
          src={currentUser?.profile?.avatarMedia?.secureUrl || ""}
          alt={formatMemberName(currentUser, currentUser?.profile)}
          size="sm"
        />
        <div className="flex-1">
          <div className="editorial-title mb-3 text-xs font-bold text-muted">
            Respond as {formatMemberName(currentUser, currentUser?.profile)}
          </div>
          <Textarea
            placeholder="Share a respectful response"
            className="border border-border bg-white text-ink"
            {...form.register("content", { required: true })}
          />
          <div className="mt-4 flex justify-end">
            <Button type="submit" loading={mutation.isPending}>
              Post Response
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
