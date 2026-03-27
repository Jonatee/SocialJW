const Joi = require("joi");

const topicSchema = Joi.object({
  name: Joi.string().max(120).required(),
  slug: Joi.string().max(160).required(),
  description: Joi.string().allow("").max(500).optional(),
  category: Joi.string().allow("").max(120).optional()
});

module.exports = {
  topicSchema
};
