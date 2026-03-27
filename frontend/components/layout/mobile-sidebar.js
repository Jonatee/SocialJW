"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Bookmark, Compass, Home, LogOut, Menu, PenSquare, Settings, Shield, User, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SquareAvatar from "@/components/branding/square-avatar";
import VerifiedBadge from "@/components/branding/verified-badge";
import api from "@/lib/api";
import { getLoginRedirectPath } from "@/lib/auth-redirect";
import { BRAND_NAME, LINKED_LOGO_URL } from "@/lib/brand";
import { formatMemberName, hasRoleBadge } from "@/lib/community";
import useAuthStore from "@/stores/auth-store";
import useUiStore from "@/stores/ui-store";

function NotificationMark({ unreadCount, compact = false }) {
  const value = unreadCount > 99 ? "99+" : String(unreadCount || 0).padStart(2, "0");
  const sizeClass = compact ? "h-8 w-8" : "h-9 w-9";

  return (
    <div className={`relative flex ${sizeClass} items-center justify-center`}>
      <div className="notification-pulse absolute inset-0 rounded-xl bg-[#dfe9f4]" />
      <div className="absolute bottom-[-3px] right-[-3px] h-4 w-4 rounded-[4px] bg-white" />
      <div className="absolute bottom-[-1px] right-[-1px] h-4 w-4 rounded-[4px] bg-accent/85" />
      <span className="editorial-title relative z-10 text-[11px] font-black tracking-[0.08em] text-white">
        {value}
      </span>
    </div>
  );
}

export default function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const openComposer = useUiStore((state) => state.openComposer);
  const isSignedIn = Boolean(currentUser);
  const username = currentUser?.username || null;
  const displayName = currentUser ? formatMemberName(currentUser, currentUser.profile) : "Guest";
  const initials = (currentUser?.profile?.displayName || currentUser?.username || "JW").slice(0, 2).toUpperCase();

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get("/notifications");
      return response.data.data;
    },
    enabled: Boolean(currentUser)
  });

  const unreadCount = (notificationsQuery.data || []).filter((item) => !item.isRead).length;

  const items = useMemo(() => {
    const nextItems = isSignedIn
      ? [
          { href: "/home", label: "Home", icon: Home },
          { href: "/discussions", label: "Discussions", icon: Compass },
          { href: "/daily-text", label: "Daily Discussion", icon: Compass },
          { href: "/questions", label: "Questions", icon: Compass },
          { href: "/notifications", label: "Notifications", icon: null },
          { href: "/bookmarks", label: "Saved", icon: Bookmark },
          { href: username ? `/profile/${username}` : "/home", label: "Profile", icon: User },
          { href: "/settings", label: "Settings", icon: Settings }
        ]
      : [
          { href: "/home", label: "Home", icon: Home },
          { href: "/discussions", label: "Discussions", icon: Compass },
          { href: "/auth/login", label: "Login", icon: User }
        ];

    if (currentUser?.role === "admin") {
      nextItems.push({ href: "/admin", label: "Admin", icon: Shield });
    }

    if (currentUser?.role === "moderator") {
      nextItems.push({ href: "/moderator", label: "Moderator", icon: Shield });
    }

    return nextItems;
  }, [currentUser?.role, isSignedIn, username]);

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Clear local session even if the backend session is already invalid.
    } finally {
      setOpen(false);
      clearSession();
      router.replace("/auth/login");
    }
  }

  function handleComposerOpen() {
    setOpen(false);
    if (!isSignedIn) {
      router.push(getLoginRedirectPath(pathname || "/home"));
      return;
    }

    openComposer();
  }

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 border-b border-border bg-[#f8fbff]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-ink"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <Image
            src={LINKED_LOGO_URL}
            alt={BRAND_NAME}
            width={132}
            height={40}
            className="h-10 w-auto rounded-xl object-contain"
            unoptimized
          />
          <button
            type="button"
            onClick={handleComposerOpen}
            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white"
          >
            <PenSquare size={14} />
            Share
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation backdrop"
            onClick={() => setOpen(false)}
            className="overlay-fade absolute inset-0 bg-[#1E3A5F]/20 backdrop-blur-sm"
          />

          <aside className="panel-reveal relative flex h-full w-[86%] max-w-[320px] flex-col border-r border-border bg-[#f8fbff] p-5 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <SquareAvatar
                  initials={initials}
                  size="sm"
                  src={currentUser?.profile?.avatarMedia?.secureUrl || ""}
                  alt={displayName}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="editorial-title truncate text-sm font-bold text-ink">{displayName}</div>
                    {hasRoleBadge(currentUser) ? (
                      <VerifiedBadge
                        compact
                        className="shrink-0"
                        roleLabel={currentUser?.role === "admin" ? "Admin" : "Moderator"}
                      />
                    ) : null}
                  </div>
                  <div className="truncate text-xs text-muted">@{username || "jwsocial_user"}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-ink"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isNotifications = item.label === "Notifications";
                const isActive =
                  pathname === item.href || (item.href !== "/home" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`hover-lift flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? "bg-[#e9f1f8] text-ink" : "text-muted hover:bg-[#e9f1f8] hover:text-ink"
                    }`}
                  >
                    {isNotifications ? (
                      unreadCount ? <NotificationMark unreadCount={unreadCount} compact /> : <Bell size={18} />
                    ) : (
                      <Icon size={18} />
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 pt-6">
              <button
                type="button"
                onClick={handleComposerOpen}
                className="editorial-title hover-lift flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(59,130,246,0.18)]"
              >
                <PenSquare size={16} className="mr-2" />
                Share
              </button>
              {isSignedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hover-lift flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted transition hover:bg-[#e9f1f8] hover:text-ink"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
