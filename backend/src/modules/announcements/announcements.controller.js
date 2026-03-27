const asyncHandler = require("../../utils/async-handler");
const { sendSuccess } = require("../../utils/response");
const service = require("./announcements.service");

const list = asyncHandler(async (req, res) => {
  const items = await service.listAnnouncements();
  sendSuccess(res, { data: items });
});

const create = asyncHandler(async (req, res) => {
  const item = await service.createAnnouncement(req.user.id, req.body);
  sendSuccess(res, { statusCode: 201, data: item, message: "Announcement created" });
});

module.exports = {
  list,
  create
};
