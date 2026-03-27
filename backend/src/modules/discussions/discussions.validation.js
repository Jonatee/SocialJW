const Joi = require("joi");

const createDiscussionSchema = Joi.object({
  title: Joi.string().max(180).required(),
  prompt: Joi.string().max(5000).required(),
  scriptureReferences: Joi.array().items(Joi.string().max(120)).default([]),
  topicIds: Joi.array().items(Joi.string()).default([]),
  isDailyDiscussion: Joi.boolean().default(false),
  isPinned: Joi.boolean().default(false),
  startsAt: Joi.date().optional(),
  endsAt: Joi.date().allow(null).optional()
});

const manageDiscussionSchema = Joi.object({
  isPinned: Joi.boolean().optional(),
  isLocked: Joi.boolean().optional(),
  archivedAt: Joi.date().allow(null).optional()
});

module.exports = {
  createDiscussionSchema,
  manageDiscussionSchema
};
