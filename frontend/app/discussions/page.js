import AppShell from "@/components/layout/app-shell";
import DiscussionsData from "@/components/data/discussions-data";
import DiscussionCta from "@/components/discussions/discussion-cta";

export default function DiscussionsPage() {
  return (
    <AppShell requireAuth={false}>
      <section className="panel p-6">
        <div className="editorial-title text-3xl font-black text-ink">Discussions</div>
        <p className="mt-2 text-sm text-muted">
          Thoughtful spiritual prompts, meeting reflections, and kind community conversation.
        </p>
      </section>
      <DiscussionCta mode="discussion" />
      <DiscussionsData />
    </AppShell>
  );
}
