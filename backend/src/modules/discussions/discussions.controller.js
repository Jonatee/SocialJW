const asyncHandler = require("../../utils/async-handler");
const { sendSuccess } = require("../../utils/response");
const service = require("./discussions.service");

const list = asyncHandler(async (req, res) => {
  const items = await service.listDiscussions();
  sendSuccess(res, { data: items });
});

const create = asyncHandler(async (req, res) => {
  const item = await service.createDiscussion(req.user.id, req.body);
  sendSuccess(res, { statusCode: 201, data: item, message: "Discussion created" });
});

const getOne = asyncHandler(async (req, res) => {
  const item = await service.getDiscussion(req.params.id);
  sendSuccess(res, { data: item });
});

const comment = asyncHandler(async (req, res) => {
  const item = await service.createDiscussionComment(req.user.id, req.params.id, req.body);
  sendSuccess(res, { statusCode: 201, data: item, message: "Response added" });
});

const lock = asyncHandler(async (req, res) => {
  const item = await service.lockDiscussion(req.params.id);
  sendSuccess(res, { data: item, message: "Discussion locked" });
});

const updateState = asyncHandler(async (req, res) => {
  const item = await service.updateDiscussionState(req.params.id, req.body);
  sendSuccess(res, { data: item, message: "Discussion updated" });
});

module.exports = {
  list,
  create,
  getOne,
  comment,
  lock,
  updateState
};
