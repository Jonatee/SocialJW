const express = require("express");
const Joi = require("joi");
const validate = require("../../validators/validate");
const { requireAuth, requireRole } = require("../../middlewares/auth");
const controller = require("./admin.controller");

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/users", controller.users);
router.patch(
  "/users/:id/status",
  validate(Joi.object({ status: Joi.string().valid("active", "suspended", "banned").required() })),
  controller.updateStatus
);
router.get("/stats", controller.stats);
router.get("/audit-logs", controller.auditLogs);
router.get("/community-settings", controller.communitySettings);
router.patch(
  "/community-settings",
  validate(
    Joi.object({
      guidelinesTitle: Joi.string().max(180).optional(),
      guidelinesBody: Joi.string().max(5000).optional(),
      mutedWords: Joi.array().items(Joi.string()).optional(),
      mediaPostingEnabled: Joi.boolean().optional(),
      allowVideoUploads: Joi.boolean().optional()
    })
  ),
  controller.updateCommunitySettings
);

module.exports = router;
