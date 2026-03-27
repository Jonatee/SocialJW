const express = require("express");
const validate = require("../../validators/validate");
const { requireAuth, optionalAuth, requireRole } = require("../../middlewares/auth");
const { writeRateLimiter, interactionRateLimiter } = require("../../middlewares/rate-limit");
const controller = require("./discussions.controller");
const { createDiscussionSchema, manageDiscussionSchema } = require("./discussions.validation");
const { createCommentSchema } = require("../comments/comments.validation");

const router = express.Router();

router.get("/", optionalAuth, controller.list);
router.post("/", requireAuth, writeRateLimiter, validate(createDiscussionSchema), controller.create);
router.get("/:id", optionalAuth, controller.getOne);
router.post("/:id/comments", requireAuth, writeRateLimiter, validate(createCommentSchema), controller.comment);
router.patch("/:id/lock", requireAuth, requireRole("moderator", "admin"), interactionRateLimiter, controller.lock);
router.patch(
  "/:id",
  requireAuth,
  requireRole("moderator", "admin"),
  interactionRateLimiter,
  validate(manageDiscussionSchema),
  controller.updateState
);

module.exports = router;
