const express = require("express");
const validate = require("../../validators/validate");
const { requireAuth, requireRole } = require("../../middlewares/auth");
const controller = require("./announcements.controller");
const { createAnnouncementSchema } = require("./announcements.validation");

const router = express.Router();

router.get("/", controller.list);
router.post("/", requireAuth, requireRole("moderator", "admin"), validate(createAnnouncementSchema), controller.create);

module.exports = router;
