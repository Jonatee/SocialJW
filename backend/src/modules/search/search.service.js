const User = require("../users/user.model");
const Profile = require("../profiles/profile.model");
const Post = require("../posts/post.model");
const Media = require("../media/media.model");
const Hashtag = require("./hashtag.model");
const postsService = require("../posts/posts.service");
const Topic = require("../topics/topic.model");
const DiscussionThread = require("../discussions/discussion-thread.model");

async function searchUsers(q) {
  const regex = new RegExp(q, "i");
  const users = await User.find({
    $or: [{ username: regex }, { usernameDisplay: regex }],
    deletedAt: null
  })
    .limit(20)
    .lean();

  const profiles = await Profile.find({ userId: { $in: users.map((item) => item.id) } }).lean();
  const avatarMediaIds = [...new Set(profiles.map((profile) => profile.avatarMediaId).filter(Boolean))];
  const mediaItems = avatarMediaIds.length ? await Media.find({ id: { $in: avatarMediaIds }, deletedAt: null }).lean() : [];

  return users.map((user) => ({
    ...user,
    profile:
      profiles.find((profile) => profile.userId === user.id) && {
        ...profiles.find((profile) => profile.userId === user.id),
        avatarMedia:
          mediaItems.find((item) => item.id === profiles.find((profile) => profile.userId === user.id)?.avatarMediaId) ||
          null
      }
  }));
}

async function searchPosts(q, viewerId = null) {
  const posts = await Post.find(
    {
      $text: { $search: q },
      deletedAt: null
    },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .lean();

  return postsService.enrichPosts(posts, viewerId);
}

async function searchTags(q) {
  return Hashtag.find({ normalizedTag: new RegExp(q, "i") }).sort({ usageCount: -1 }).limit(20).lean();
}

async function searchTopics(q) {
  return Topic.find({
    deletedAt: null,
    $or: [{ name: new RegExp(q, "i") }, { description: new RegExp(q, "i") }, { category: new RegExp(q, "i") }]
  })
    .sort({ name: 1 })
    .limit(20)
    .lean();
}

async function searchDiscussions(q) {
  return DiscussionThread.find({
    deletedAt: null,
    archivedAt: null,
    $or: [{ title: new RegExp(q, "i") }, { prompt: new RegExp(q, "i") }]
  })
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(20)
    .lean();
}

module.exports = {
  searchUsers,
  searchPosts,
  searchTags,
  searchTopics,
  searchDiscussions
};
