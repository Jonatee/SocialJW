const User = require("../users/user.model");
const Post = require("../posts/post.model");
const Comment = require("../comments/comment.model");
const ModerationAction = require("../moderation/moderation-action.model");
const Announcement = require("../announcements/announcement.model");
const DailyTextEntry = require("../daily-text/daily-text.model");
const Topic = require("../topics/topic.model");
const DiscussionThread = require("../discussions/discussion-thread.model");
const CommunitySettings = require("./community-settings.model");

async function listUsers({ page = 1, limit = 20, q = "" }) {
  const skip = (Number(page) - 1) * Number(limit);
  const filter = q
    ? {
        $or: [
          { username: new RegExp(q, "i") },
          { email: new RegExp(q, "i") },
          { usernameDisplay: new RegExp(q, "i") }
        ]
      }
    : {};

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(filter)
  ]);

  return {
    items,
    total,
    page: Number(page),
    limit: Number(limit)
  };
}

async function updateUserStatus(id, status) {
  return User.findOneAndUpdate({ id }, { status, modifiedAt: new Date() }, { new: true });
}

async function getStats() {
  const [users, posts, comments, auditLogs, discussions, announcements, topics, dailyTexts] = await Promise.all([
    User.countDocuments({}),
    Post.countDocuments({ deletedAt: null }),
    Comment.countDocuments({ deletedAt: null }),
    ModerationAction.countDocuments({}),
    DiscussionThread.countDocuments({ deletedAt: null, archivedAt: null }),
    Announcement.countDocuments({ deletedAt: null }),
    Topic.countDocuments({ deletedAt: null }),
    DailyTextEntry.countDocuments({ deletedAt: null, status: { $ne: "archived" } })
  ]);

  return { users, posts, comments, auditLogs, discussions, announcements, topics, dailyTexts };
}

async function getAuditLogs() {
  return ModerationAction.find({}).sort({ createdAt: -1 }).limit(100).lean();
}

async function getCommunitySettings() {
  const existing = await CommunitySettings.findOne({ key: "community-settings" }).lean();
  if (existing) {
    return existing;
  }

  const created = await CommunitySettings.create({ key: "community-settings" });
  return created.toObject();
}

async function updateCommunitySettings(payload) {
  return CommunitySettings.findOneAndUpdate(
    { key: "community-settings" },
    { ...payload, modifiedAt: new Date() },
    { upsert: true, new: true }
  );
}

module.exports = {
  listUsers,
  updateUserStatus,
  getStats,
  getAuditLogs,
  getCommunitySettings,
  updateCommunitySettings
};
