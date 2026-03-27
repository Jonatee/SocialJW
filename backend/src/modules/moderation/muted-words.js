const AppError = require("../../utils/app-error");
const Notification = require("../notifications/notification.model");

const DEFAULT_MUTED_WORDS = [
  "idiot",
  "stupid",
  "fool",
  "hate you",
  "damn you",
  "shut up",
  "nonsense",
  "useless"
];

function getMutedWords() {
  const configured = String(process.env.MUTED_WORDS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set([...DEFAULT_MUTED_WORDS, ...configured])];
}

function findMutedWord(text = "") {
  const normalized = String(text).toLowerCase();
  return getMutedWords().find((word) => normalized.includes(word)) || null;
}

async function assertTextAllowed({ userId, text, entityType }) {
  const blockedWord = findMutedWord(text);
  if (!blockedWord) {
    return;
  }

  await Notification.create({
    recipientId: userId,
    type: "content_warning",
    entityType,
    entityId: "",
    message: `Your ${entityType} could not be published because it contains restricted language. Please revise and try again.`
  });

  throw new AppError(
    "Your message includes restricted language and could not be published. Please revise it and try again.",
    400,
    { code: "muted_word_detected", blockedWord }
  );
}

module.exports = {
  getMutedWords,
  findMutedWord,
  assertTextAllowed
};
