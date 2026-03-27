"use client";

import { Bookmark } from "lucide-react";
import InfiniteFeedList from "@/components/data/infinite-feed-list";

export default function BookmarksView() {
  return (
    <div className="space-y-2">
      <section className="panel p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Bookmark size={20} />
          </div>
          <div className="editorial-title text-3xl font-black text-ink">Saved</div>
        </div>
        <p className="mt-2 text-sm text-muted">Encouraging posts and reflections you saved for later.</p>
      </section>
      <InfiniteFeedList
        queryKey={["bookmarks"]}
        endpoint="/bookmarks"
        emptyMessage="Nothing has been saved yet."
        withContainer
      />
    </div>
  );
}
