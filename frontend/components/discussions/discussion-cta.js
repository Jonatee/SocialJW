"use client";

import Link from "next/link";
import { MessageSquarePlus, PenSquare } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { getLoginRedirectPath } from "@/lib/auth-redirect";
import useAuthStore from "@/stores/auth-store";
import useUiStore from "@/stores/ui-store";

export default function DiscussionCta({ mode = "discussion" }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useAuthStore((state) => state.currentUser);
  const openComposer = useUiStore((state) => state.openComposer);

  function handlePrimaryAction() {
    if (!currentUser) {
      router.push(getLoginRedirectPath(pathname || "/discussions"));
      return;
    }

    openComposer();
  }

  const title =
    mode === "question" ? "Have a sincere question?" : "Have something encouraging to share?";
  const body =
    mode === "question"
      ? "Start with a thoughtful question, a scripture reference, or a practical point for brothers and sisters to discuss."
      : "Start a calm discussion, share a scripture note, or post an encouraging thought for the community.";
  const primaryLabel = mode === "question" ? "Ask a Question" : "Start a Discussion";

  return (
    <section className="panel p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="editorial-title text-2xl font-black text-ink">{title}</div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="inline-flex items-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            <PenSquare size={16} className="mr-2" />
            {primaryLabel}
          </button>
          <Link
            href="/daily-text"
            className="inline-flex items-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-[#f7fbff]"
          >
            <MessageSquarePlus size={16} className="mr-2" />
            Open Daily Discussion
          </Link>
        </div>
      </div>
    </section>
  );
}
