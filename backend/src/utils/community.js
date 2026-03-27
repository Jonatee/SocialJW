function getHonorificFromGender(gender) {
  return gender === "female" ? "Sister" : "Brother";
}

function formatDisplayName(user = {}, profile = null) {
  const baseName =
    profile?.displayName || user.usernameDisplay || user.username || "Member";

  return `${user.honorificDisplay || getHonorificFromGender(user.gender)} ${baseName}`.trim();
}

function hasCommunityBadge(user = {}) {
  return ["moderator", "admin"].includes(user.role);
}

module.exports = {
  getHonorificFromGender,
  formatDisplayName,
  hasCommunityBadge
};
