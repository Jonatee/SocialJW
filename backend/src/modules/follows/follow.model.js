const createBaseSchema = require("../shared/base-schema");
const { mongoose } = require("../../db/mongoose");

const followSchema = createBaseSchema({
  sourceUserId: { type: String, index: true },
  targetUserId: { type: String, index: true },
  followerId: { type: String, required: true, index: true },
  followingId: { type: String, required: true, index: true },
  status: {
    type: String,
    enum: ["active", "pending", "accepted", "blocked"],
    default: "accepted"
  }
});

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
followSchema.pre("validate", function syncAliases(next) {
  this.sourceUserId = this.followerId;
  this.targetUserId = this.followingId;
  next();
});

module.exports = mongoose.models.Follow || mongoose.model("Follow", followSchema);
