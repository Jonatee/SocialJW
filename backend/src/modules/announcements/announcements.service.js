const Announcement = require("./announcement.model");

async function listAnnouncements() {
  const now = new Date();
  return Announcement.find({
    deletedAt: null,
    $and: [
      { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
      { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] }
    ]
  })
    .sort({ isPinned: -1, startsAt: -1, createdAt: -1 })
    .lean();
}

async function createAnnouncement(authorId, payload) {
  return Announcement.create({
    ...payload,
    authorId
  });
}

module.exports = {
  listAnnouncements,
  createAnnouncement
};
