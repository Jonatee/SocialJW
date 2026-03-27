const createBaseSchema = require("../shared/base-schema");
const { mongoose } = require("../../db/mongoose");

const discussionThreadSchema = createBaseSchema({
  title: { type: String, required: true },
  prompt: { type: String, required: true },
  authorId: { type: String, required: true, index: true },
  scriptureReferences: { type: [String], default: [] },
  topicIds: { type: [String], default: [] },
  isDailyDiscussion: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date, default: null },
  commentCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  archivedAt: { type: Date, default: null }
});

module.exports =
  mongoose.models.DiscussionThread || mongoose.model("DiscussionThread", discussionThreadSchema);
