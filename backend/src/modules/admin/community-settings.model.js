const createBaseSchema = require("../shared/base-schema");
const { mongoose } = require("../../db/mongoose");

const communitySettingsSchema = createBaseSchema({
  key: { type: String, default: "community-settings", unique: true, index: true },
  guidelinesTitle: { type: String, default: "Community Guidelines" },
  guidelinesBody: {
    type: String,
    default:
      "Keep every discussion respectful, calm, scripture-centered, and encouraging. Avoid harsh speech, divisive exchanges, and attention-seeking behavior."
  },
  mutedWords: { type: [String], default: [] },
  mediaPostingEnabled: { type: Boolean, default: true },
  allowVideoUploads: { type: Boolean, default: true }
});

module.exports =
  mongoose.models.CommunitySettings || mongoose.model("CommunitySettings", communitySettingsSchema);
