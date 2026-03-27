require("../config/env");

const bcrypt = require("bcryptjs");
const { connectMongo } = require("./mongoose");
const User = require("../modules/users/user.model");
const Profile = require("../modules/profiles/profile.model");
const UserSettings = require("../modules/users/user-settings.model");
const Post = require("../modules/posts/post.model");
const Follow = require("../modules/follows/follow.model");
const Comment = require("../modules/comments/comment.model");
const Topic = require("../modules/topics/topic.model");
const DailyTextEntry = require("../modules/daily-text/daily-text.model");
const Announcement = require("../modules/announcements/announcement.model");
const DiscussionThread = require("../modules/discussions/discussion-thread.model");

async function ensureUser({ username, email, password, role = "user", gender, displayName, congregationDisplay, bio }) {
  let user = await User.findOne({ $or: [{ username }, { email }] });
  const passwordHash = await bcrypt.hash(password, 12);

  if (!user) {
    user = await User.create({
      username,
      usernameDisplay: displayName,
      email,
      passwordHash,
      role,
      gender,
      congregationDisplay: congregationDisplay || "",
      status: "active",
      isEmailVerified: true,
      isVerified: ["moderator", "admin"].includes(role)
    });
  } else {
    Object.assign(user, {
      usernameDisplay: displayName,
      gender,
      role,
      congregationDisplay: congregationDisplay || "",
      status: "active",
      isEmailVerified: true,
      isVerified: ["moderator", "admin"].includes(role)
    });
    await user.save();
  }

  let profile = await Profile.findOne({ userId: user.id });
  if (!profile) {
    profile = await Profile.create({
      userId: user.id,
      displayName,
      congregationDisplay: congregationDisplay || "",
      bio,
      location: "Lagos",
      spiritualInterests: ["Daily Bible reading", "Family worship"],
      favoriteScriptures: ["Philippians 4:6,7", "Isaiah 41:10"]
    });
  }

  let settings = await UserSettings.findOne({ userId: user.id });
  if (!settings) {
    settings = await UserSettings.create({ userId: user.id });
  }

  user.profileId = profile.id;
  user.settingsId = settings.id;
  await user.save();

  return { user, profile };
}

async function seed() {
  await connectMongo();

  const people = await Promise.all([
    ensureUser({
      username: "brother_james",
      email: "brother.james@jwsocial.local",
      password: "Password123!",
      gender: "male",
      displayName: "James",
      congregationDisplay: "Ikeja West",
      bio: "Enjoys thoughtful discussion after congregation meetings."
    }),
    ensureUser({
      username: "sister_ruth",
      email: "sister.ruth@jwsocial.local",
      password: "Password123!",
      gender: "female",
      displayName: "Ruth",
      congregationDisplay: "Surulere Central",
      bio: "Appreciates encouraging comments and daily spiritual reminders."
    }),
    ensureUser({
      username: "brother_daniel",
      email: "brother.daniel@jwsocial.local",
      password: "Password123!",
      gender: "male",
      displayName: "Daniel",
      congregationDisplay: "Yaba",
      bio: "Often shares lessons from Bible reading and ministry experiences."
    }),
    ensureUser({
      username: "jwsocial_moderator",
      email: "moderator@jwsocial.local",
      password: "Password123!",
      role: "moderator",
      gender: "male",
      displayName: "Community Desk",
      congregationDisplay: "Admin Desk",
      bio: "Moderator account for JWSocial."
    }),
    ensureUser({
      username: "jwsocial_admin",
      email: "admin@jwsocial.local",
      password: "Password123!",
      role: "admin",
      gender: "male",
      displayName: "Service Overseer Desk",
      congregationDisplay: "Admin Desk",
      bio: "Administrator account for JWSocial."
    })
  ]);

  const [james, ruth, daniel, moderator, admin] = people.map((entry) => entry.user);

  await Topic.deleteMany({});
  const topics = await Topic.insertMany([
    { name: "Family Life", slug: "family-life", description: "Applying Bible principles at home", category: "Living" },
    { name: "Meeting Gems", slug: "meeting-gems", description: "Encouraging takeaways from congregation meetings", category: "Meetings" },
    { name: "Ministry Kindness", slug: "ministry-kindness", description: "Ways to show patience and kindness in the ministry", category: "Ministry" },
    { name: "Daily Reading", slug: "daily-reading", description: "Reflections from personal Bible reading", category: "Study" }
  ]);

  await Follow.deleteMany({});
  await Follow.insertMany([
    { followerId: james.id, followingId: ruth.id, status: "accepted" },
    { followerId: ruth.id, followingId: james.id, status: "accepted" },
    { followerId: daniel.id, followingId: james.id, status: "accepted" }
  ]);

  await Post.deleteMany({});
  const posts = await Post.insertMany([
    {
      authorId: james.id,
      type: "encouragement",
      content: "What lesson encouraged you from today’s reading? Psalm 34 reminded me that Jehovah stays close to those who need comfort.",
      plainTextContent: "what lesson encouraged you from today’s reading? psalm 34 reminded me that jehovah stays close to those who need comfort.",
      scriptureReferences: ["Psalm 34:18"],
      topicIds: [topics[3].id],
      visibility: "public",
      status: "active",
      moderationStatus: "approved"
    },
    {
      authorId: ruth.id,
      type: "question",
      content: "How do we keep a gentle spirit when family routines become stressful during the week?",
      plainTextContent: "how do we keep a gentle spirit when family routines become stressful during the week?",
      scriptureReferences: ["Colossians 3:12"],
      topicIds: [topics[0].id],
      visibility: "public",
      status: "active",
      moderationStatus: "approved"
    }
  ]);

  await Comment.deleteMany({});
  await Comment.insertMany([
    {
      postId: posts[0].id,
      targetType: "post",
      targetId: posts[0].id,
      authorId: ruth.id,
      content: "That verse helped me too. It reminded me to trust Jehovah more calmly during anxious moments.",
      plainTextContent: "that verse helped me too. it reminded me to trust jehovah more calmly during anxious moments.",
      scriptureReferences: ["Philippians 4:6,7"]
    },
    {
      postId: posts[1].id,
      targetType: "post",
      targetId: posts[1].id,
      authorId: daniel.id,
      content: "Prayer before difficult moments really helps set the tone in our home.",
      plainTextContent: "prayer before difficult moments really helps set the tone in our home."
    }
  ]);

  await DiscussionThread.deleteMany({});
  await DiscussionThread.insertMany([
    {
      title: "What did you appreciate from this week’s meeting?",
      prompt: "Share one point that strengthened your faith and how you hope to apply it this week.",
      authorId: moderator.id,
      scriptureReferences: ["Hebrews 10:24,25"],
      topicIds: [topics[1].id],
      isPinned: true,
      isDailyDiscussion: false
    },
    {
      title: "How can we show kindness in the ministry?",
      prompt: "Discuss practical ways to stay kind and patient in every conversation.",
      authorId: moderator.id,
      scriptureReferences: ["Colossians 4:6"],
      topicIds: [topics[2].id],
      isDailyDiscussion: true
    }
  ]);

  await DailyTextEntry.deleteMany({});
  await DailyTextEntry.create({
    title: "Daily Discussion",
    scripture: "Isaiah 41:10",
    bodyText: "Jehovah strengthens us when responsibilities feel heavy. Today’s focus is calm reliance on his help.",
    discussionQuestion: "How has this verse helped you stay balanced this week?",
    publishedDate: new Date(),
    createdByUserId: moderator.id,
    status: "published"
  });

  await Announcement.deleteMany({});
  await Announcement.insertMany([
    {
      title: "Community Reminder",
      body: "Please keep all discussions respectful, scripture-centered, and free from harsh speech.",
      authorId: admin.id,
      priority: "high",
      startsAt: new Date(),
      isPinned: true
    }
  ]);

  console.log("JWSocial seed complete");
  console.log("Admin login");
  console.log("  identity: admin@jwsocial.local");
  console.log("  password: Password123!");
  console.log("Moderator login");
  console.log("  identity: moderator@jwsocial.local");
  console.log("  password: Password123!");

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
