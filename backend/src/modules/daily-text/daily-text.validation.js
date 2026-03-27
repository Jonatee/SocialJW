const Joi = require("joi");

const upsertDailyTextSchema = Joi.object({
  title: Joi.string().max(180).required(),
  scripture: Joi.string().max(180).required(),
  bodyText: Joi.string().max(5000).allow("").required(),
  officialSourceUrl: Joi.string().allow("").optional(),
  discussionQuestion: Joi.string().max(400).required(),
  publishedDate: Joi.date().required(),
  status: Joi.string().valid("draft", "published", "archived").default("published")
});

module.exports = {
  upsertDailyTextSchema
};
