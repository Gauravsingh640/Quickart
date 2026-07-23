import {Session} from "../models/sessionModel.js";
/**
 * Get user's AI session
 */
export const getSession = async (userId) => {
  return await Session.findOne({ userId });
};

/**
 * Create session if it doesn't exist
 */
export const createSession = async (userId) => {
  let session = await Session.findOne({ userId });

  if (!session) {
    session = await Session.create({
      userId,
      lastIntent: "",
      lastQuery: "",
      lastProducts: [],
      chatHistory: [],
    });
  }

  return session;
};

/**
 * Save current conversation
 */
export const saveConversation = async (
  userId,
  intent,
  query,
  products = []
) => {
  let session = await createSession(userId);

  session.lastIntent = intent;
  session.lastQuery = query;
  session.lastProducts = products.map((p) => p._id);

  session.chatHistory.push({
    role: "user",
    message: query,
  });

  await session.save();

  return session;
};

/**
 * Save AI response
 */
export const saveAIResponse = async (userId, answer) => {
  const session = await createSession(userId);

  session.chatHistory.push({
    role: "assistant",
    message: answer,
  });

  await session.save();

  return session;
};

/**
 * Get recent chat history
 */
export const getRecentHistory = async (userId, limit = 6) => {
  const session = await Session.findOne({ userId });

  if (!session) {
    return [];
  }

  return session.chatHistory.slice(-limit);
};