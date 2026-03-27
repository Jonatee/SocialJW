"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import AdminTable from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";

export function AdminDashboardData() {
  return null;
}

export function ModeratorDashboardData() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["moderator-jwsocial-dashboard"],
    queryFn: async () => {
      const [reportsResponse, discussionsResponse, announcementsResponse, dailyTextResponse] = await Promise.all([
        api.get("/moderation/reports"),
        api.get("/discussions"),
        api.get("/announcements"),
        api.get("/daily-text")
      ]);

      return {
        reports: reportsResponse.data.data || [],
        discussions: discussionsResponse.data.data || [],
        announcements: announcementsResponse.data.data || [],
        dailyTexts: dailyTextResponse.data.data || []
      };
    }
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ id, status, resolutionNote = "" }) => {
      await api.patch(`/moderation/reports/${id}`, {
        status,
        resolutionNote
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderator-jwsocial-dashboard"] });
    }
  });

  const moderateTargetMutation = useMutation({
    mutationFn: async ({ report, actionType, reason }) => {
      await api.post("/moderation/actions", {
        targetType: report.targetType,
        targetId: report.targetId,
        actionType,
        reason,
        metadata: {
          reportId: report.id
        }
      });

      await api.patch(`/moderation/reports/${report.id}`, {
        status: "resolved",
        resolutionNote: reason
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderator-jwsocial-dashboard"] });
    }
  });

  const discussionMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      await api.patch(`/discussions/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderator-jwsocial-dashboard"] });
    }
  });

  if (isLoading) {
    return <div className="panel p-6 text-sm text-muted">Loading moderation workspace...</div>;
  }

  if (error || !data) {
    return <div className="panel p-6 text-sm text-accent">Failed to load moderation workspace.</div>;
  }

  const reportRows = (data.reports || []).map((report) => {
    const postHref =
      report.targetType === "post"
        ? `/posts/${report.targetId}`
        : report.targetType === "comment" && report.target?.postId
          ? `/posts/${report.target.postId}`
          : null;
    const userHref = report.targetType === "user" && report.target?.username ? `/profile/${report.target.username}` : null;
    const targetLabel =
      report.targetType === "post"
        ? report.target?.content || "Reported post"
        : report.targetType === "comment"
          ? report.target?.content || "Reported comment"
          : report.target?.usernameDisplay || report.target?.username || "Reported user";
    const isBusy = updateReportMutation.isPending || moderateTargetMutation.isPending;

    return [
      report.reasonCode,
      <div key={`${report.id}-target`} className="space-y-1">
        <div className="text-sm text-ink">{targetLabel}</div>
        {postHref ? (
          <Link href={postHref} className="text-xs text-accent hover:text-ink">
            Open post
          </Link>
        ) : null}
        {userHref ? (
          <Link href={userHref} className="text-xs text-accent hover:text-ink">
            Open profile
          </Link>
        ) : null}
      </div>,
      report.status,
      <div key={`${report.id}-actions`} className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={isBusy}
          onClick={() => updateReportMutation.mutate({ id: report.id, status: "reviewing", resolutionNote: "Under review" })}
        >
          Review
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={isBusy || !["post", "comment"].includes(report.targetType)}
          onClick={() =>
            moderateTargetMutation.mutate({
              report,
              actionType: "hide",
              reason: `Hidden after report: ${report.reasonCode}`
            })
          }
        >
          Hide Content
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isBusy}
          onClick={() => updateReportMutation.mutate({ id: report.id, status: "dismissed", resolutionNote: "Dismissed by moderator" })}
        >
          Dismiss
        </Button>
      </div>
    ];
  });

  const discussionRows = (data.discussions || []).slice(0, 10).map((item) => [
    item.title,
    item.isPinned ? "Pinned" : "Normal",
    item.isLocked ? "Locked" : "Open",
    <div key={`${item.id}-discussion-actions`} className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="secondary"
        loading={discussionMutation.isPending}
        onClick={() => discussionMutation.mutate({ id: item.id, payload: { isPinned: !item.isPinned } })}
      >
        {item.isPinned ? "Unpin" : "Pin"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        loading={discussionMutation.isPending}
        onClick={() => discussionMutation.mutate({ id: item.id, payload: { isLocked: !item.isLocked } })}
      >
        {item.isLocked ? "Unlock" : "Lock"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        loading={discussionMutation.isPending}
        onClick={() => discussionMutation.mutate({ id: item.id, payload: { archivedAt: new Date().toISOString() } })}
      >
        Archive
      </Button>
    </div>
  ]);

  return (
    <div className="space-y-8">
      <section className="panel p-6">
        <div className="editorial-title text-3xl font-black text-ink">Moderator Workspace</div>
        <p className="mt-2 text-sm text-muted">
          Review reports, keep discussions calm, and monitor the current daily discussion and announcements.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <AdminTable
          title="Reports Queue"
          columns={["Reason", "Target", "Status", "Actions"]}
          rows={reportRows}
        />
        <AdminTable
          title="Discussion Controls"
          columns={["Title", "Pinned", "Status", "Actions"]}
          rows={discussionRows}
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <AdminTable
          title="Live Announcements"
          columns={["Title", "Priority", "Pinned"]}
          rows={(data.announcements || []).slice(0, 8).map((item) => [item.title, item.priority, item.isPinned ? "Yes" : "No"])}
        />
        <AdminTable
          title="Daily Discussion Entries"
          columns={["Title", "Scripture", "Status"]}
          rows={(data.dailyTexts || []).slice(0, 8).map((item) => [item.title, item.scripture, item.status])}
        />
      </div>
    </div>
  );
}
