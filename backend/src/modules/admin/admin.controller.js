const asyncHandler = require("../../utils/async-handler");
const { sendSuccess } = require("../../utils/response");
const adminService = require("./admin.service");

const users = asyncHandler(async (req, res) => {
  const result = await adminService.listUsers(req.query);
  return sendSuccess(res, { message: "Users loaded", data: result.items, meta: result });
});

const updateStatus = asyncHandler(async (req, res) => {
  const result = await adminService.updateUserStatus(req.params.id, req.body.status);
  return sendSuccess(res, { message: "User status updated", data: result });
});

const stats = asyncHandler(async (req, res) => {
  const result = await adminService.getStats();
  return sendSuccess(res, { message: "Admin stats loaded", data: result });
});

const auditLogs = asyncHandler(async (req, res) => {
  const result = await adminService.getAuditLogs();
  return sendSuccess(res, { message: "Audit logs loaded", data: result });
});

const communitySettings = asyncHandler(async (req, res) => {
  const result = await adminService.getCommunitySettings();
  return sendSuccess(res, { message: "Community settings loaded", data: result });
});

const updateCommunitySettings = asyncHandler(async (req, res) => {
  const result = await adminService.updateCommunitySettings(req.body);
  return sendSuccess(res, { message: "Community settings updated", data: result });
});

module.exports = {
  users,
  updateStatus,
  stats,
  auditLogs,
  communitySettings,
  updateCommunitySettings
};
