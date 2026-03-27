const asyncHandler = require("../../utils/async-handler");
const { sendSuccess } = require("../../utils/response");
const service = require("./daily-text.service");

const list = asyncHandler(async (req, res) => {
  const items = await service.listDailyText();
  sendSuccess(res, { data: items });
});

const create = asyncHandler(async (req, res) => {
  const item = await service.createDailyText(req.user.id, req.body);
  sendSuccess(res, { statusCode: 201, data: item, message: "Daily discussion published" });
});

const update = asyncHandler(async (req, res) => {
  const item = await service.updateDailyText(req.params.id, req.body);
  sendSuccess(res, { data: item, message: "Daily discussion updated" });
});

module.exports = {
  list,
  create,
  update
};
