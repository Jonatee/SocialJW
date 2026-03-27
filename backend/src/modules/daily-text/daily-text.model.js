const createBaseSchema = require("../shared/base-schema");
const { mongoose } = require("../../db/mongoose");

const dailyTextSchema = createBaseSchema({
  title: { type: String, required: true },
  scripture: { type: String, required: true },
  bodyText: { type: String, default: "" },
  officialSourceUrl: { type: String, default: "" },
  discussionQuestion: { type: String, required: true },
  publishedDate: { type: Date, required: true, index: true },
  createdByUserId: { type: String, required: true },
  status: { type: String, enum: ["draft", "published", "archived"], default: "published", index: true }
});

module.exports = mongoose.models.DailyTextEntry || mongoose.model("DailyTextEntry", dailyTextSchema);
