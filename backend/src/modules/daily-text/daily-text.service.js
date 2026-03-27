const DailyTextEntry = require("./daily-text.model");

async function listDailyText() {
  return DailyTextEntry.find({ deletedAt: null, status: { $ne: "archived" } })
    .sort({ publishedDate: -1, createdAt: -1 })
    .lean();
}

async function createDailyText(userId, payload) {
  return DailyTextEntry.create({
    ...payload,
    createdByUserId: userId
  });
}

async function updateDailyText(id, payload) {
  return DailyTextEntry.findOneAndUpdate({ id, deletedAt: null }, { ...payload, modifiedAt: new Date() }, { new: true });
}

module.exports = {
  listDailyText,
  createDailyText,
  updateDailyText
};
