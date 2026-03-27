const Joi = require("joi");

const createPostSchema = Joi.object({
  type: Joi.string()
    .valid("text", "media", "question", "encouragement", "scripture_note", "repost", "quote_repost")
    .required(),
  visibility: Joi.string().valid("public", "followers", "private").default("public"),
  content: Joi.string().allow("").max(5000).optional(),
  scriptureReferences: Joi.array().items(Joi.string().max(120)).default([]),
  topicIds: Joi.array().items(Joi.string()).default([]),
  mediaIds: Joi.array().items(Joi.string()).max(4).default([]),
  originalPostId: Joi.string().allow(null, "").optional(),
  quoteText: Joi.string().allow("").max(500).optional()
});

const updatePostSchema = Joi.object({
  content: Joi.string().allow("").max(5000).required(),
  scriptureReferences: Joi.array().items(Joi.string().max(120)).optional(),
  topicIds: Joi.array().items(Joi.string()).optional()
});

const repostSchema = Joi.object({
  type: Joi.string().valid("repost", "quote_repost").required(),
  quoteText: Joi.string().allow("").max(500).optional()
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  repostSchema
};
