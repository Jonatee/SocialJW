const createBaseSchema = require("../shared/base-schema");
const { mongoose } = require("../../db/mongoose");

const profileSchema = createBaseSchema({
  userId: { type: String, required: true, index: true, unique: true },
  displayName: { type: String, required: true },
  bio: { type: String, default: "" },
  website: { type: String, default: "" },
  location: { type: String, default: "" },
  congregationDisplay: { type: String, default: "" },
  spiritualInterests: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  favoriteScriptures: { type: [String], default: [] },
  avatarMediaId: { type: String, default: null },
  bannerMediaId: { type: String, default: null },
  accentColor: { type: String, default: "#5e7fa3" },
  occupation: { type: String, default: "" }
});

module.exports = mongoose.models.Profile || mongoose.model("Profile", profileSchema);
