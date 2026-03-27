const createBaseSchema = require("../shared/base-schema");
const { mongoose } = require("../../db/mongoose");

const announcementSchema = createBaseSchema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  authorId: { type: String, required: true, index: true },
  priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date, default: null },
  isPinned: { type: Boolean, default: false }
});

module.exports = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
