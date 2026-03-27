const Joi = require("joi");

const createAnnouncementSchema = Joi.object({
  title: Joi.string().max(180).required(),
  body: Joi.string().max(5000).required(),
  priority: Joi.string().valid("low", "normal", "high").default("normal"),
  startsAt: Joi.date().optional(),
  endsAt: Joi.date().allow(null).optional(),
  isPinned: Joi.boolean().optional()
});

module.exports = {
  createAnnouncementSchema
};
