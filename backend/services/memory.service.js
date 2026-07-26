import { Session } from "../models/sessionModel.js";

/**
 * ==========================================
 * CREATE NEW CHAT
 * ==========================================
 */
export const createSession = async (
  userId,
  title = "New Chat"
) => {
  const session = await Session.create({
    userId,
    title,
    lastIntent: "",
    lastQuery: "",
    lastProducts: [],
    searchProducts: [],
    chatHistory: [],
  });

  return session;
};

/**
 * ==========================================
 * GET ONE CHAT
 * ==========================================
 */
export const getSession = async (
  userId,
  chatId
) => {
  if (!chatId) {
    return null;
  }

  return await Session.findOne({
    _id: chatId,
    userId,
  });
};

/**
 * ==========================================
 * GET ALL USER CHATS
 * ==========================================
 *
 * Used for sidebar:
 *
 * Today
 * Samsung vs Sony
 * Best laptops
 *
 * Yesterday
 * iPhone options
 */
export const getUserChats = async (userId) => {
  return await Session.find({
    userId,
  })
    .select(
      "_id title createdAt updatedAt"
    )
    .sort({
      updatedAt: -1,
    });
};

/**
 * ==========================================
 * GENERATE CHAT TITLE
 * ==========================================
 *
 * For now title is generated from first
 * user message.
 *
 * Later we can use AI title generation
 * if needed.
 */
export const generateChatTitle = (message) => {
  if (!message) {
    return "New Chat";
  }

  let title = message
    .trim()
    .replace(/\s+/g, " ");

  // Special comparison title
  const compareMatch = title.match(
    /compare\s+(.+?)\s+(?:and|vs|versus)\s+(.+)/i
  );

  if (compareMatch) {
    const first = compareMatch[1].trim();
    const second = compareMatch[2].trim();

    title = `${first} vs ${second}`;
  }

  // Keep sidebar title short
  if (title.length > 45) {
    title =
      title.substring(0, 42).trim() +
      "...";
  }

  return title;
};

/**
 * ==========================================
 * SAVE USER MESSAGE
 * ==========================================
 */
export const saveConversation = async (
  userId,
  chatId,
  intent,
  query,
  products = []
) => {
  const session = await getSession(
    userId,
    chatId
  );

  if (!session) {
    throw new Error("Chat session not found");
  }

  session.lastIntent = intent;
  session.lastQuery = query;

  // ==========================================
  // CURRENTLY DISPLAYED PRODUCTS
  // ==========================================

  session.lastProducts = products
    .filter((product) => product?._id)
    .map((product) => product._id);

  // ==========================================
  // ORIGINAL SEARCH PRODUCTS
  // ==========================================

  if (["SEARCH_PRODUCT", "COMPARE"].includes(intent) && products.length > 0) {
    session.searchProducts = products
        .filter((product) => product?._id)
        .map((product) => product._id);
  }

  // ==========================================
  // FIRST MESSAGE → CHAT TITLE
  // ==========================================

  const hasUserMessage =
    session.chatHistory.some(
      (item) => item.role === "user"
    );

  if (!hasUserMessage) {
    session.title =
      generateChatTitle(query);
  }

  // ==========================================
  // SAVE USER MESSAGE
  // ==========================================

  session.chatHistory.push({
    role: "user",
    message: query,
    products: [],
  });

  await session.save();

  return session;
};

/**
 * ==========================================
 * SAVE AI RESPONSE
 * ==========================================
 */
export const saveAIResponse = async (
  userId,
  chatId,
  answer,
  products = []
) => {
  const session = await getSession(
    userId,
    chatId
  );

  if (!session) {
    throw new Error("Chat session not found");
  }

  session.chatHistory.push({
    role: "assistant",
    message: answer,

    products: products
      .filter((product) => product?._id)
      .map((product) => product._id),
  });

  await session.save();

  return session;
};

/**
 * ==========================================
 * GET RECENT HISTORY
 * ==========================================
 *
 * AI gets context ONLY from currently
 * selected chat.
 */
export const getRecentHistory = async (
  userId,
  chatId,
  limit = 6
) => {
  const session = await getSession(
    userId,
    chatId
  );

  if (!session) {
    return [];
  }

  return session.chatHistory.slice(
    -limit
  );
};

/**
 * ==========================================
 * GET LAST DISPLAYED PRODUCTS
 * ==========================================
 */
export const getLastProducts = async (
  userId,
  chatId
) => {
  if (!chatId) {
    return [];
  }

  const session = await Session.findOne({
    _id: chatId,
    userId,
  }).populate("lastProducts");

  if (!session) {
    return [];
  }

  return session.lastProducts || [];
};

/**
 * ==========================================
 * GET ORIGINAL SEARCH PRODUCTS
 * ==========================================
 */
export const getSearchProducts = async (
  userId,
  chatId
) => {
  if (!chatId) {
    return [];
  }

  const session = await Session.findOne({
    _id: chatId,
    userId,
  }).populate("searchProducts");

  if (!session) {
    return [];
  }

  return session.searchProducts || [];
};

/**
 * ==========================================
 * GET COMPLETE CHAT HISTORY
 * ==========================================
 *
 * Used when user clicks an old chat
 * from sidebar.
 */
export const getFullChatHistory = async (
  userId,
  chatId
) => {
  if (!chatId) {
    return [];
  }

  const session = await Session.findOne({
    _id: chatId,
    userId,
  }).populate("chatHistory.products");

  if (!session) {
    return [];
  }

  return session.chatHistory || [];
};

/**
 * ==========================================
 * DELETE ONE CHAT
 * ==========================================
 *
 * We are NOT deleting every chat anymore.
 */
export const deleteChat = async (
  userId,
  chatId
) => {
  if (!chatId) {
    return null;
  }

  return await Session.findOneAndDelete({
    _id: chatId,
    userId,
  });
};

/**
 * ==========================================
 * CLEAR ONE CHAT'S MESSAGES
 * ==========================================
 *
 * Optional utility.
 *
 * Keeps the chat itself but removes
 * conversation.
 */
export const clearChatHistory = async (
  userId,
  chatId
) => {
  const session = await getSession(
    userId,
    chatId
  );

  if (!session) {
    return null;
  }

  session.chatHistory = [];
  session.lastProducts = [];
  session.searchProducts = [];
  session.lastIntent = "";
  session.lastQuery = "";
  session.title = "New Chat";

  await session.save();

  return session;
};