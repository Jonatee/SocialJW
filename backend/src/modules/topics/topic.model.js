const createBaseSchema = require("../shared/base-schema");
const { mongoose } = require("../../db/mongoose");

const topicSchema = createBaseSchema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, default: "" },
  category: { type: String, default: "general" }
});

module.exports = mongoose.models.Topic || mongoose.model("Topic", topicSchema);
