import AppShell from "@/components/layout/app-shell";
import FeedList from "@/components/data/feed-list";

export default function HomePage() {
  return (
    <AppShell requireAuth={false}>
      <section className="panel p-6">
        <div className="editorial-title text-3xl font-black text-ink">Home</div>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Daily discussions, encouraging thoughts, and reflections from connected brothers and sisters appear here first.
        </p>
      </section>
      <FeedList queryKey={["feed"]} endpoint="/feed" emptyMessage="No encouraging posts have been shared yet." />
    </AppShell>
  );
}
