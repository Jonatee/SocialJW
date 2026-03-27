"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SquareAvatar from "@/components/branding/square-avatar";
import VerifiedBadge from "@/components/branding/verified-badge";
import { getLoginRedirectPath } from "@/lib/auth-redirect";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import useAuthStore from "@/stores/auth-store";
import { hasRoleBadge } from "@/lib/community";

export default function ProfileHeader({ profile }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);

  const followMutation = useMutation({
    mutationFn: async () => {
      if (profile.viewerState.following) {
        await api.delete(`/users/${profile.userId}/follow`);
      } else {
        await api.post(`/users/${profile.userId}/follow`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", profile.username] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    }
  });

  const blockMutation = useMutation({
    mutationFn: async () => {
      if (profile.viewerState.blockedByViewer) {
        await api.delete(`/users/${profile.userId}/block`);
      } else {
        await api.post(`/users/${profile.userId}/block`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", profile.username] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    }
  });

  const busy = followMutation.isPending || blockMutation.isPending;

  function requireLogin() {
    router.push(getLoginRedirectPath(pathname || `/profile/${profile.username}`));
  }

  return (
    <section className="panel overflow-hidden">
      <div className="relative subtle-grid h-44 bg-[linear-gradient(135deg,#f8fbff_0%,#dfe9f4_55%,#bfd0e0_100%)]">
        {profile.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.bannerUrl} alt={`${profile.displayName} banner`} className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-white/10" />
      </div>
      <div className="p-6">
        <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SquareAvatar
            size="lg"
            initials={profile.initials}
            src={profile.avatarUrl}
            alt={profile.displayName}
          />
          {profile.viewerState.isSelf ? (
            <Button variant="secondary" onClick={() => router.push("/profile/edit")}>
              Edit profile
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {!profile.viewerState.hasBlockedViewer ? (
                <Button
                  variant={profile.viewerState.following ? "secondary" : "primary"}
                  onClick={() => {
                    if (!currentUser) {
                      requireLogin();
                      return;
                    }

                    followMutation.mutate();
                  }}
                  loading={followMutation.isPending}
                  disabled={busy || profile.viewerState.blockedByViewer}
                >
                  {profile.viewerState.following ? "Connected" : "Connect"}
                </Button>
              ) : (
                <Button variant="secondary" disabled>
                  Blocked you
                </Button>
              )}

              <Button
                variant="secondary"
                onClick={() => {
                  if (!currentUser) {
                    requireLogin();
                    return;
                  }

                  blockMutation.mutate();
                }}
                loading={blockMutation.isPending}
                disabled={busy}
              >
                <Ban size={16} className="mr-2" />
                {profile.viewerState.blockedByViewer ? "Unblock" : "Block"}
              </Button>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="editorial-title text-3xl font-black text-ink">{profile.displayName}</h1>
            {hasRoleBadge(profile.user) ? (
              <VerifiedBadge roleLabel={profile.user?.role === "admin" ? "Admin" : "Moderator"} />
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted">@{profile.username}</p>
          <div className="mt-4 flex items-center gap-6 text-sm text-[#29445e]">
            <div>
              <span className="font-bold text-ink">{profile.followingCount}</span> Connected to
            </div>
            <div>
              <span className="font-bold text-ink">{profile.followerCount}</span> Brothers and sisters
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#29445e]">{profile.bio}</p>
          {profile.viewerState.blockedByViewer ? (
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-accent">You blocked this account. Posts and engagement are disabled.</p>
          ) : null}
          {profile.viewerState.hasBlockedViewer ? (
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-accent">This account has blocked you.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
