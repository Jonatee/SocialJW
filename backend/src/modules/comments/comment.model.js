const createBaseSchema = require("../shared/base-schema");
const { mongoose } = require("../../db/mongoose");

const commentSchema = createBaseSchema({
  targetType: { type: String, enum: ["post", "discussion"], default: "post", index: true },
  targetId: { type: String, default: "", index: true },
  postId: { type: String, required: true, index: true },
  authorId: { type: String, required: true, index: true },
  parentCommentId: { type: String, default: null, index: true },
  rootCommentId: { type: String, default: null },
  content: { type: String, required: true },
  plainTextContent: { type: String, default: "" },
  scriptureReferences: { type: [String], default: [] },
  mentionUserIds: { type: [String], default: [] },
  isPinned: { type: Boolean, default: false },
  status: { type: String, enum: ["active", "hidden", "removed", "under_review"], default: "active" },
  moderationStatus: { type: String, enum: ["approved", "pending", "rejected"], default: "approved" },
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date, default: null },
  stats: {
    likeCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 }
  }
});

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.pre("validate", function syncCommentTargets(next) {
  this.targetType = this.targetType || "post";
  this.targetId = this.targetId || this.postId;
  next();
});

module.exports = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
