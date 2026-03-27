const express = require("express");
const validate = require("../../validators/validate");
const { requireAuth, requireRole } = require("../../middlewares/auth");
const controller = require("./topics.controller");
const { topicSchema } = require("./topics.validation");

const router = express.Router();

router.get("/", controller.list);
router.post("/", requireAuth, requireRole("admin", "moderator"), validate(topicSchema), controller.create);
router.patch("/:id", requireAuth, requireRole("admin", "moderator"), validate(topicSchema), controller.update);

module.exports = router;
