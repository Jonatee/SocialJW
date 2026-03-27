const express = require("express");
const { optionalAuth } = require("../../middlewares/auth");
const controller = require("./search.controller");

const router = express.Router();

router.get("/", optionalAuth, controller.globalSearch);
router.get("/users", controller.users);
router.get("/posts", optionalAuth, controller.posts);
router.get("/tags", controller.tags);
router.get("/topics", controller.topics);
router.get("/discussions", controller.discussions);

module.exports = router;
