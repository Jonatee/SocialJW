"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellRing, BookOpenText, MessageSquareQuote, Settings2, ShieldCheck, Tags, Users } from "lucide-react";
import api from "@/lib/api";
import AdminTable from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAuthStore from "@/stores/auth-store";

function StatCard({ label, value, icon: Icon }) {
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="editorial-title text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{label}</div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/12 text-accent">
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 text-3xl font-black text-ink">{value}</div>
    </section>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div className="mb-4">
      <div className="editorial-title text-xl font-black text-ink">{title}</div>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  );
}

export default function AdminOverview() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const queryClient = useQueryClient();
  const [dailyTextForm, setDailyTextForm] = useState({
    title: "Daily Discussion",
    scripture: "",
    bodyText: "",
    discussionQuestion: "",
    officialSourceUrl: "",
    publishedDate: new Date().toISOString().slice(0, 10),
    status: "published"
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    body: "",
    priority: "normal",
    isPinned: true
  });
  const [topicForm, setTopicForm] = useState({
    name: "",
    slug: "",
    description: "",
    category: ""
  });
  const [settingsForm, setSettingsForm] = useState({
    guidelinesTitle: "Community Guidelines",
    guidelinesBody: "",
    mutedWords: "",
    mediaPostingEnabled: true,
    allowVideoUploads: true
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-jwsocial-overview"],
    queryFn: async () => {
      const [statsResponse, usersResponse, logsResponse, reportsResponse, settingsResponse, dailyTextResponse, announcementsResponse, topicsResponse, discussionsResponse] =
        await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users", { params: { page: 1, limit: 10 } }),
          api.get("/admin/audit-logs"),
          api.get("/moderation/reports"),
          api.get("/admin/community-settings"),
          api.get("/daily-text"),
          api.get("/announcements"),
          api.get("/topics"),
          api.get("/discussions")
        ]);

      return {
        stats: statsResponse.data.data,
        users: usersResponse.data.data,
        usersMeta: usersResponse.data.meta,
        logs: logsResponse.data.data,
        reports: reportsResponse.data.data,
        settings: settingsResponse.data.data,
        dailyTexts: dailyTextResponse.data.data,
        announcements: announcementsResponse.data.data,
        topics: topicsResponse.data.data,
        discussions: discussionsResponse.data.data
      };
    },
    enabled: currentUser?.role === "admin"
  });

  useEffect(() => {
    if (!data?.settings) {
      return;
    }

    setSettingsForm({
      guidelinesTitle: data.settings.guidelinesTitle || "Community Guidelines",
      guidelinesBody: data.settings.guidelinesBody || "",
      mutedWords: (data.settings.mutedWords || []).join(", "),
      mediaPostingEnabled: Boolean(data.settings.mediaPostingEnabled),
      allowVideoUploads: Boolean(data.settings.allowVideoUploads)
    });
  }, [data?.settings]);

  const createDailyTextMutation = useMutation({
    mutationFn: async () => {
      await api.post("/daily-text", dailyTextForm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jwsocial-overview"] });
    }
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async () => {
      await api.post("/announcements", announcementForm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jwsocial-overview"] });
    }
  });

  const createTopicMutation = useMutation({
    mutationFn: async () => {
      await api.post("/topics", topicForm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jwsocial-overview"] });
      setTopicForm({ name: "", slug: "", description: "", category: "" });
    }
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      await api.patch("/admin/community-settings", {
        ...settingsForm,
        mutedWords: settingsForm.mutedWords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jwsocial-overview"] });
    }
  });

  if (!currentUser) {
    return <div className="panel p-6 text-sm text-muted">Load your session to access the admin dashboard.</div>;
  }

  if (currentUser.role !== "admin") {
    return <div className="panel p-6 text-sm text-accent">This dashboard is available to admins only.</div>;
  }

  if (isLoading) {
    return <div className="panel p-6 text-sm text-muted">Loading admin dashboard...</div>;
  }

  if (error || !data) {
    return <div className="panel p-6 text-sm text-accent">Failed to load the admin dashboard.</div>;
  }

  const statCards = [
    { label: "Users", value: data.stats.users, icon: Users },
    { label: "Discussions", value: data.stats.discussions, icon: MessageSquareQuote },
    { label: "Daily Text", value: data.stats.dailyTexts, icon: BookOpenText },
    { label: "Announcements", value: data.stats.announcements, icon: BellRing },
    { label: "Topics", value: data.stats.topics, icon: Tags },
    { label: "Audit", value: data.stats.auditLogs, icon: ShieldCheck }
  ];

  return (
    <div className="space-y-8">
      <section className="panel p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <ShieldCheck size={22} />
          </div>
          <div className="editorial-title text-3xl font-black text-ink">JWSocial Admin</div>
        </div>
        <p className="mt-2 text-sm text-muted">
          Manage daily discussions, announcements, topics, user access, moderation signals, and community settings.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} />
        ))}
      </div>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="panel p-6">
          <SectionTitle
            title="Daily Discussion Publishing"
            description="Publish the current daily scripture, thought, and question without relying on external scraping."
          />
          <div className="space-y-3">
            <Input
              value={dailyTextForm.title}
              onChange={(event) => setDailyTextForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Title"
              className="border border-border bg-white text-ink"
            />
            <Input
              value={dailyTextForm.scripture}
              onChange={(event) => setDailyTextForm((current) => ({ ...current, scripture: event.target.value }))}
              placeholder="Scripture"
              className="border border-border bg-white text-ink"
            />
            <Textarea
              value={dailyTextForm.bodyText}
              onChange={(event) => setDailyTextForm((current) => ({ ...current, bodyText: event.target.value }))}
              placeholder="Body text"
              className="border border-border bg-white text-ink"
            />
            <Textarea
              value={dailyTextForm.discussionQuestion}
              onChange={(event) =>
                setDailyTextForm((current) => ({ ...current, discussionQuestion: event.target.value }))
              }
              placeholder="Discussion question"
              className="border border-border bg-white text-ink"
            />
            <Input
              type="date"
              value={dailyTextForm.publishedDate}
              onChange={(event) => setDailyTextForm((current) => ({ ...current, publishedDate: event.target.value }))}
              className="border border-border bg-white text-ink"
            />
            <Button type="button" onClick={() => createDailyTextMutation.mutate()} loading={createDailyTextMutation.isPending}>
              Publish Daily Discussion
            </Button>
          </div>
        </div>

        <div className="panel p-6">
          <SectionTitle
            title="Announcement Publishing"
            description="Pin calm notices, meeting reminders, and community guidance."
          />
          <div className="space-y-3">
            <Input
              value={announcementForm.title}
              onChange={(event) => setAnnouncementForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Announcement title"
              className="border border-border bg-white text-ink"
            />
            <Textarea
              value={announcementForm.body}
              onChange={(event) => setAnnouncementForm((current) => ({ ...current, body: event.target.value }))}
              placeholder="Announcement body"
              className="border border-border bg-white text-ink"
            />
            <div className="flex flex-wrap gap-3">
              <select
                value={announcementForm.priority}
                onChange={(event) => setAnnouncementForm((current) => ({ ...current, priority: event.target.value }))}
                className="rounded-md border border-border bg-white px-4 py-3 text-sm text-ink"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={announcementForm.isPinned}
                  onChange={(event) => setAnnouncementForm((current) => ({ ...current, isPinned: event.target.checked }))}
                />
                Pin this announcement
              </label>
            </div>
            <Button type="button" onClick={() => createAnnouncementMutation.mutate()} loading={createAnnouncementMutation.isPending}>
              Publish Announcement
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="panel p-6">
          <SectionTitle title="Topic Management" description="Create and maintain topic categories used across discussions and feed relevance." />
          <div className="space-y-3">
            <Input
              value={topicForm.name}
              onChange={(event) => setTopicForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Topic name"
              className="border border-border bg-white text-ink"
            />
            <Input
              value={topicForm.slug}
              onChange={(event) => setTopicForm((current) => ({ ...current, slug: event.target.value }))}
              placeholder="topic-slug"
              className="border border-border bg-white text-ink"
            />
            <Input
              value={topicForm.category}
              onChange={(event) => setTopicForm((current) => ({ ...current, category: event.target.value }))}
              placeholder="Category"
              className="border border-border bg-white text-ink"
            />
            <Textarea
              value={topicForm.description}
              onChange={(event) => setTopicForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Description"
              className="border border-border bg-white text-ink"
            />
            <Button type="button" onClick={() => createTopicMutation.mutate()} loading={createTopicMutation.isPending}>
              Create Topic
            </Button>
          </div>
        </div>

        <div className="panel p-6">
          <SectionTitle
            title="Community Settings"
            description="Set guidelines, muted words, and media policy for a calmer discussion environment."
          />
          <div className="space-y-3">
            <Input
              value={settingsForm.guidelinesTitle}
              onChange={(event) => setSettingsForm((current) => ({ ...current, guidelinesTitle: event.target.value }))}
              placeholder="Guidelines title"
              className="border border-border bg-white text-ink"
            />
            <Textarea
              value={settingsForm.guidelinesBody}
              onChange={(event) => setSettingsForm((current) => ({ ...current, guidelinesBody: event.target.value }))}
              placeholder="Guidelines body"
              className="border border-border bg-white text-ink"
            />
            <Textarea
              value={settingsForm.mutedWords}
              onChange={(event) => setSettingsForm((current) => ({ ...current, mutedWords: event.target.value }))}
              placeholder="Muted words, separated by commas"
              className="border border-border bg-white text-ink"
            />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={settingsForm.mediaPostingEnabled}
                onChange={(event) =>
                  setSettingsForm((current) => ({ ...current, mediaPostingEnabled: event.target.checked }))
                }
              />
              Allow media posting
            </label>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={settingsForm.allowVideoUploads}
                onChange={(event) =>
                  setSettingsForm((current) => ({ ...current, allowVideoUploads: event.target.checked }))
                }
              />
              Allow video uploads
            </label>
            <Button type="button" onClick={() => saveSettingsMutation.mutate()} loading={saveSettingsMutation.isPending}>
              Save Community Settings
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <AdminTable
          title={`Recent Daily Discussions (${data.dailyTexts.length})`}
          columns={["Title", "Scripture", "Published", "Status"]}
          rows={(data.dailyTexts || []).slice(0, 6).map((item) => [
            item.title,
            item.scripture,
            item.publishedDate ? new Date(item.publishedDate).toLocaleDateString() : "Not set",
            item.status
          ])}
        />
        <AdminTable
          title={`Recent Announcements (${data.announcements.length})`}
          columns={["Title", "Priority", "Pinned", "Starts"]}
          rows={(data.announcements || []).slice(0, 6).map((item) => [
            item.title,
            item.priority,
            item.isPinned ? "Yes" : "No",
            item.startsAt ? new Date(item.startsAt).toLocaleDateString() : "Not set"
          ])}
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <AdminTable
          title={`Topic Library (${data.topics.length})`}
          columns={["Name", "Slug", "Category"]}
          rows={(data.topics || []).slice(0, 10).map((item) => [item.name, item.slug, item.category || "General"])}
        />
        <AdminTable
          title={`Users (${data.usersMeta?.total || data.users.length})`}
          columns={["Username", "Role", "Status", "Email"]}
          rows={(data.users || []).map((user) => [user.username, user.role, user.status, user.email])}
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <AdminTable
          title="Recent Reports"
          columns={["Reason", "Target", "Status"]}
          rows={(data.reports || []).slice(0, 8).map((report) => [
            report.reasonCode || "general",
            report.target?.content || report.target?.usernameDisplay || report.target?.username || "Unknown target",
            report.status
          ])}
        />
        <AdminTable
          title="Audit Logs"
          columns={["Actor", "Action", "Target"]}
          rows={(data.logs || []).slice(0, 8).map((log) => [log.actorId, log.actionType, `${log.targetType}:${log.targetId}`])}
        />
      </div>
    </div>
  );
}
