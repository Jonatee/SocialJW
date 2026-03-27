const Topic = require("./topic.model");

async function listTopics() {
  return Topic.find({ deletedAt: null }).sort({ name: 1 }).lean();
}

async function createTopic(payload) {
  return Topic.create(payload);
}

async function updateTopic(id, payload) {
  return Topic.findOneAndUpdate({ id, deletedAt: null }, { ...payload, modifiedAt: new Date() }, { new: true });
}

module.exports = {
  listTopics,
  createTopic,
  updateTopic
};
