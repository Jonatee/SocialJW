const Joi = require("joi");

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  scriptureReferences: Joi.array().items(Joi.string().max(120)).default([]),
  postId: Joi.string().optional()
});

module.exports = {
  createCommentSchema
};
