const AppError = require("../../utils/app-error");
const DiscussionThread = require("./discussion-thread.model");
const Comment = require("../comments/comment.model");
const User = require("../users/user.model");
const Profile = require("../profiles/profile.model");
const Media = require("../media/media.model");
const Notification = require("../notifications/notification.model");
const { assertTextAllowed } = require("../moderation/muted-words");
const commentsService = require("../comments/comments.service");

async function enrichThreads(items) {
  const authorIds = [...new Set(items.map((item) => item.authorId))];
  const authors = await User.find({ id: { $in: authorIds }, deletedAt: null }).lean();
  const profiles = await Profile.find({ userId: { $in: authorIds } }).lean();
  const avatarMediaIds = [...new Set(profiles.map((item) => item.avatarMediaId).filter(Boolean))];
  const mediaItems = avatarMediaIds.length ? await Media.find({ id: { $in: avatarMediaIds }, deletedAt: null }).lean() : [];

  return items.map((item) => {
    const author = authors.find((entry) => entry.id === item.authorId) || null;
    const profile = profiles.find((entry) => entry.userId === item.authorId) || null;
    return {
      ...item,
      author: author
        ? {
            ...author,
            profile: profile
              ? {
                  ...profile,
                  avatarMedia: mediaItems.find((media) => media.id === profile.avatarMediaId) || null
                }
              : null
          }
        : null
    };
  });
}

async function listDiscussions({ questionOnly = false } = {}) {
  const filter = {
    deletedAt: null,
    archivedAt: null,
    ...(questionOnly ? { isDailyDiscussion: false } : {})
  };
  const items = await DiscussionThread.find(filter).sort({ isPinned: -1, startsAt: -1, createdAt: -1 }).lean();
  return enrichThreads(items);
}

async function createDiscussion(authorId, payload) {
  await assertTextAllowed({
    userId: authorId,
    entityType: "discussion",
    text: `${payload.title} ${payload.prompt}`
  });

  return DiscussionThread.create({
    ...payload,
    authorId
  });
}

async function getDiscussion(id) {
  const item = await DiscussionThread.findOne({ id, deletedAt: null }).lean();
  if (!item) {
    throw new AppError("Discussion not found", 404);
  }

  const [thread] = await enrichThreads([item]);
  const comments = await Comment.find({ targetType: "discussion", targetId: id, deletedAt: null }).sort({ createdAt: 1 }).lean();
  return { thread, comments: await commentsService.enrichComments(comments) };
}

async function createDiscussionComment(authorId, discussionId, payload) {
  const thread = await DiscussionThread.findOne({ id: discussionId, deletedAt: null });
  if (!thread) {
    throw new AppError("Discussion not found", 404);
  }
  if (thread.isLocked) {
    throw new AppError("This discussion is locked", 400);
  }

  await assertTextAllowed({
    userId: authorId,
    entityType: "comment",
    text: payload.content
  });

  const comment = await Comment.create({
    targetType: "discussion",
    targetId: discussionId,
    postId: discussionId,
    authorId,
    content: payload.content,
    plainTextContent: payload.content.toLowerCase(),
    scriptureReferences: payload.scriptureReferences || [],
    parentCommentId: payload.parentCommentId || null,
    rootCommentId: payload.rootCommentId || payload.parentCommentId || null
  });

  await DiscussionThread.updateOne({ id: discussionId }, { $inc: { commentCount: 1 } });
  if (thread.authorId !== authorId) {
    await Notification.create({
      recipientId: thread.authorId,
      actorId: authorId,
      type: "comment",
      entityType: "discussion",
      entityId: discussionId,
      message: "responded to your discussion"
    });
  }

  return comment;
}

async function lockDiscussion(id) {
  return DiscussionThread.findOneAndUpdate({ id, deletedAt: null }, { isLocked: true, modifiedAt: new Date() }, { new: true });
}

async function deleteDiscussion(actor, id) {
  const thread = await DiscussionThread.findOne({ id, deletedAt: null });
  if (!thread) {
    throw new AppError("Discussion not found", 404);
  }

  const canDelete = actor?.role === "admin" || actor?.role === "moderator" || thread.authorId === actor?.id;
  if (!canDelete) {
    throw new AppError("You are not allowed to remove this discussion", 403);
  }

  const deletedAt = new Date();
  await DiscussionThread.updateOne(
    { id, deletedAt: null },
    {
      deletedAt,
      archivedAt: deletedAt,
      modifiedAt: deletedAt
    }
  );

  await Comment.updateMany(
    { targetType: "discussion", targetId: id, deletedAt: null },
    { deletedAt, modifiedAt: deletedAt, status: "removed" }
  );

  return { success: true };
}

async function updateDiscussionState(id, payload) {
  return DiscussionThread.findOneAndUpdate({ id, deletedAt: null }, { ...payload, modifiedAt: new Date() }, { new: true });
}

module.exports = {
  listDiscussions,
  createDiscussion,
  getDiscussion,
  createDiscussionComment,
  lockDiscussion,
  deleteDiscussion,
  updateDiscussionState
};
