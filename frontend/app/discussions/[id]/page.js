import AppShell from "@/components/layout/app-shell";
import DiscussionDetailData from "@/components/data/discussion-detail-data";

export default async function DiscussionDetailPage({ params }) {
  const resolvedParams = await params;

  return (
    <AppShell requireAuth={false}>
      <DiscussionDetailData discussionId={resolvedParams.id} />
    </AppShell>
  );
}
