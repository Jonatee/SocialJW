import { formatMemberName, hasRoleBadge } from "@/lib/community";

function buildVideoPosterUrl(item = {}) {
  if (item.thumbnailUrl && item.thumbnailUrl !== item.secureUrl) {
    return item.thumbnailUrl;
  }

  const sourceUrl = item.secureUrl || "";
  if (!sourceUrl.includes("/video/upload/")) {
    return "";
  }

  const transformed = sourceUrl.replace("/video/upload/", "/video/upload/so_0,f_jpg/");
  return transformed.replace(/\.[^/.?#]+(?=([?#].*)?$)/, ".jpg");
}

function buildVideoPlaybackUrl(item = {}) {
  const sourceUrl = item.secureUrl || "";
  if (!sourceUrl.includes("/video/upload/")) {
    return sourceUrl;
  }

  const transformed = sourceUrl.replace("/video/upload/", "/video/upload/f_mp4,q_auto,vc_auto/");
  return transformed.replace(/\.[^/.?#]+(?=([?#].*)?$)/, ".mp4");
}

export function formatPost(post) {
  const relationship = post.viewerState?.relationship || {};
  const original = post.originalPost || null;
  const engagementSource = (post.type === "repost" || post.type === "quote_repost") && original ? original : post;

  return {
    id: post.id,
    actionPostId: engagementSource.id || post.id,
    type: post.type || "text",
    author: {
      id: post.author?.id || post.authorId || "",
      name: formatMemberName(post.author, post.author?.profile),
      username: post.author?.username || "unknown",
      initials: (post.author?.profile?.displayName || post.author?.usernameDisplay || post.author?.username || "JW")
        .slice(0, 2)
        .toUpperCase(),
      avatarUrl: post.author?.profile?.avatarMedia?.secureUrl || "",
      hasBadge: hasRoleBadge(post.author),
      badgeLabel: post.author?.role === "admin" ? "Admin" : "Moderator"
    },
    content: post.content || post.quoteText || "",
    createdAtLabel: post.createdAt ? new Date(post.createdAt).toLocaleString() : "now",
    media: (post.media || []).map((item) => ({
      id: item.id,
      type: item.type,
      url: item.secureUrl,
      alt: item.altText,
      duration: item.duration || 0,
      thumbnailUrl: item.thumbnailUrl || "",
      posterUrl: item.type === "video" ? buildVideoPosterUrl(item) : "",
      playbackUrl: item.type === "video" ? buildVideoPlaybackUrl(item) : item.secureUrl
    })),
    originalPost: original
      ? {
          id: original.id,
          createdAtLabel: original.createdAt ? new Date(original.createdAt).toLocaleString() : "now",
          author: {
            id: original.author?.id || original.authorId || "",
            name: formatMemberName(original.author, original.author?.profile),
            username: original.author?.username || "unknown",
            initials: (
              original.author?.profile?.displayName ||
              original.author?.usernameDisplay ||
              original.author?.username ||
              "JW"
            )
              .slice(0, 2)
              .toUpperCase(),
            avatarUrl: original.author?.profile?.avatarMedia?.secureUrl || "",
            hasBadge: hasRoleBadge(original.author),
            badgeLabel: original.author?.role === "admin" ? "Admin" : "Moderator"
          },
          content: original.content || original.quoteText || "",
          media: (original.media || []).map((item) => ({
            id: item.id,
            type: item.type,
            url: item.secureUrl,
            alt: item.altText,
            duration: item.duration || 0,
            thumbnailUrl: item.thumbnailUrl || "",
            posterUrl: item.type === "video" ? buildVideoPosterUrl(item) : "",
            playbackUrl: item.type === "video" ? buildVideoPlaybackUrl(item) : item.secureUrl
          })),
          stats: {
            likeCount: original.stats?.likeCount || 0,
            commentCount: original.stats?.commentCount || 0,
            repostCount: original.stats?.repostCount || 0,
            bookmarkCount: original.stats?.bookmarkCount || 0
          },
          viewerState: {
            liked: Boolean(original.viewerState?.liked),
            bookmarked: Boolean(original.viewerState?.bookmarked),
            reposted: Boolean(original.viewerState?.reposted)
          }
        }
      : null,
    quotePost: original || null,
    viewerState: {
      liked: Boolean(engagementSource.viewerState?.liked),
      bookmarked: Boolean(engagementSource.viewerState?.bookmarked),
      reposted: Boolean(engagementSource.viewerState?.reposted),
      isOwner: Boolean(relationship.isSelf),
      followingAuthor: Boolean(relationship.following),
      blockedByViewer: Boolean(relationship.blockedByViewer),
      hasBlockedViewer: Boolean(relationship.hasBlockedViewer),
      canInteract:
        relationship.canInteract === undefined ? true : Boolean(relationship.canInteract)
    },
    stats: {
      likeCount: engagementSource.stats?.likeCount || 0,
      commentCount: engagementSource.stats?.commentCount || 0,
      repostCount: engagementSource.stats?.repostCount || 0,
      bookmarkCount: engagementSource.stats?.bookmarkCount || 0
    }
  };
}
