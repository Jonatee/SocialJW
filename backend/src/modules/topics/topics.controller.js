const asyncHandler = require("../../utils/async-handler");
const { sendSuccess } = require("../../utils/response");
const service = require("./topics.service");

const list = asyncHandler(async (req, res) => {
  const items = await service.listTopics();
  sendSuccess(res, { data: items });
});

const create = asyncHandler(async (req, res) => {
  const item = await service.createTopic(req.body);
  sendSuccess(res, { statusCode: 201, data: item, message: "Topic created" });
});

const update = asyncHandler(async (req, res) => {
  const item = await service.updateTopic(req.params.id, req.body);
  sendSuccess(res, { data: item, message: "Topic updated" });
});

module.exports = {
  list,
  create,
  update
};
