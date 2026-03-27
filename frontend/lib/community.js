export const APP_NAME = "JWSocial";
export const SESSION_STORAGE_KEY = "jwsocial_access_token";
export const SESSION_CHECK_KEY = "jwsocial_session_check_attempts";

export function getHonorific(user = {}) {
  if (user?.honorificDisplay) {
    return user.honorificDisplay;
  }

  return user?.gender === "female" ? "Sister" : "Brother";
}

export function formatMemberName(user = {}, profile = null) {
  const baseName = profile?.displayName || user?.usernameDisplay || user?.username || "Member";
  return `${getHonorific(user)} ${baseName}`.trim();
}

export function hasRoleBadge(user = {}) {
  return ["moderator", "admin"].includes(user?.role);
}
