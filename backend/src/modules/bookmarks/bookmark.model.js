const createBaseSchema = require("../shared/base-schema");
const { mongoose } = require("../../db/mongoose");

const bookmarkSchema = createBaseSchema(
  {
    userId: { type: String, required: true, index: true },
    postId: { type: String, required: true, index: true },
    targetType: { type: String, enum: ["post", "discussion"], default: "post" },
    targetId: { type: String, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });
bookmarkSchema.pre("validate", function syncBookmarkTarget(next) {
  this.targetId = this.targetId || this.postId;
  next();
});

module.exports = mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema);
