const express = require("express");
const validate = require("../../validators/validate");
const { requireAuth, requireRole } = require("../../middlewares/auth");
const controller = require("./daily-text.controller");
const { upsertDailyTextSchema } = require("./daily-text.validation");

const router = express.Router();

router.get("/", controller.list);
router.post("/", requireAuth, requireRole("moderator", "admin"), validate(upsertDailyTextSchema), controller.create);
router.patch("/:id", requireAuth, requireRole("moderator", "admin"), validate(upsertDailyTextSchema), controller.update);

module.exports = router;
