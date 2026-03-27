import AppShell from "@/components/layout/app-shell";
import DiscussionsData from "@/components/data/discussions-data";
import DiscussionCta from "@/components/discussions/discussion-cta";

export default function QuestionsPage() {
  return (
    <AppShell requireAuth={false}>
      <section className="panel p-6">
        <div className="editorial-title text-3xl font-black text-ink">Questions</div>
        <p className="mt-2 text-sm text-muted">
          Browse question threads centered on Bible principles, family life, ministry, and meeting appreciation.
        </p>
      </section>
      <DiscussionCta mode="question" />
      <DiscussionsData questionOnly />
    </AppShell>
  );
}
