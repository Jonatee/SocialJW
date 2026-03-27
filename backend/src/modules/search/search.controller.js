const asyncHandler = require("../../utils/async-handler");
const { sendSuccess } = require("../../utils/response");
const searchService = require("./search.service");

const users = asyncHandler(async (req, res) => {
  const result = await searchService.searchUsers(req.query.q || "");
  return sendSuccess(res, { message: "User search complete", data: result });
});

const posts = asyncHandler(async (req, res) => {
  const result = await searchService.searchPosts(req.query.q || "", req.user?.id || null);
  return sendSuccess(res, { message: "Post search complete", data: result });
});

const tags = asyncHandler(async (req, res) => {
  const result = await searchService.searchTags(req.query.q || "");
  return sendSuccess(res, { message: "Tag search complete", data: result });
});

const topics = asyncHandler(async (req, res) => {
  const result = await searchService.searchTopics(req.query.q || "");
  return sendSuccess(res, { message: "Topic search complete", data: result });
});

const discussions = asyncHandler(async (req, res) => {
  const result = await searchService.searchDiscussions(req.query.q || "");
  return sendSuccess(res, { message: "Discussion search complete", data: result });
});

const globalSearch = asyncHandler(async (req, res) => {
  const q = req.query.q || "";
  const [usersResult, postsResult, topicsResult, discussionsResult] = await Promise.all([
    searchService.searchUsers(q),
    searchService.searchPosts(q, req.user?.id || null),
    searchService.searchTopics(q),
    searchService.searchDiscussions(q)
  ]);

  return sendSuccess(res, {
    message: "Search complete",
    data: {
      users: usersResult,
      posts: postsResult,
      topics: topicsResult,
      discussions: discussionsResult
    }
  });
});

module.exports = {
  users,
  posts,
  tags,
  topics,
  discussions,
  globalSearch
};
