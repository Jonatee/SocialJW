import AppShell from "@/components/layout/app-shell";
import DailyTextData from "@/components/data/daily-text-data";

export default function DailyTextPage() {
  return (
    <AppShell requireAuth={false}>
      <section className="panel p-6">
        <div className="editorial-title text-3xl font-black text-ink">Daily Discussion</div>
        <p className="mt-2 text-sm text-muted">
          A daily scripture, brief thought, and discussion question published by moderators or administrators.
        </p>
      </section>
      <DailyTextData />
    </AppShell>
  );
}
