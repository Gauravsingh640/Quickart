import { Session } from "../models/sessionModel.js";

/**
 * ==========================================
 * GET USER SESSION
 * ==========================================
 */
export const getSession = async (userId) => {
  return await Session.findOne({ userId });
};

/**
 * ==========================================
 * CREATE SESSION
 * ==========================================
 */
export const createSession = async (userId) => {
  let session = await Session.findOne({ userId });

  if (!session) {
    session = await Session.create({
      userId,
      lastIntent: "",
      lastQuery: "",
      lastProducts: [],
      searchProducts: [],
      chatHistory: [],
    });
  }

  return session;
};

/**
 * ==========================================
 * SAVE USER MESSAGE
 * ==========================================
 *
 * Saves:
 * - current intent
 * - current query
 * - currently displayed products
 * - original search products
 * - user chat message
 */
export const saveConversation = async (
  userId,
  intent,
  query,
  products = []
) => {
  const session = await createSession(userId);

  session.lastIntent = intent;
  session.lastQuery = query;

  // Products returned for current request
  session.lastProducts = products
    .filter((product) => product?._id)
    .map((product) => product._id);

  /**
   * Preserve original/main search results.
   *
   * Example:
   *
   * User:
   * "Best laptops"
   *
   * searchProducts:
   * [Dell, HP, Asus, Acer]
   *
   * User:
   * "Tell me about Dell"
   *
   * lastProducts:
   * [Dell]
   *
   * searchProducts remains:
   * [Dell, HP, Asus, Acer]
   */
  if (intent === "SEARCH_PRODUCT") {
    session.searchProducts = products
      .filter((product) => product?._id)
      .map((product) => product._id);
  }

  // Save user message
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
 *
 * Products are stored with the AI message
 * so they can be restored after:
 *
 * - page refresh
 * - navigating to cart
 * - navigating to another page
 * - coming back to Shopping AI
 */
export const saveAIResponse = async (
  userId,
  answer,
  products = []
) => {
  const session = await createSession(userId);

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
 * GET RECENT CHAT HISTORY
 * ==========================================
 *
 * Used by AI prompt for conversation context.
 */
export const getRecentHistory = async (
  userId,
  limit = 6
) => {
  const session = await Session.findOne({
    userId,
  });

  if (!session) {
    return [];
  }

  return session.chatHistory.slice(-limit);
};

/**
 * ==========================================
 * GET LAST DISPLAYED PRODUCTS
 * ==========================================
 *
 * Example:
 *
 * AI displayed:
 * Dell G15
 *
 * lastProducts = [Dell G15]
 */
export const getLastProducts = async (userId) => {
  const session = await Session.findOne({
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
 *
 * Example:
 *
 * User:
 * "Best laptops"
 *
 * searchProducts:
 * Dell
 * HP
 * Asus
 * Acer
 *
 * Even if user asks about Dell afterwards,
 * original results remain available.
 */
export const getSearchProducts = async (userId) => {
  const session = await Session.findOne({
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
 * Used by frontend when ShoppingAI mounts.
 *
 * Product references are populated so old
 * ProductCards can also be rendered again.
 */
export const getFullChatHistory = async (userId) => {
  const session = await Session.findOne({
    userId,
  }).populate("chatHistory.products");

  if (!session) {
    return [];
  }

  return session.chatHistory || [];
};

/**
 * ==========================================
 * CLEAR CURRENT CHAT
 * ==========================================
 *
 * Used when:
 * - User clicks "New Chat"
 * - optionally when user logs out
 *
 * IMPORTANT:
 * Long-term UserMemory is NOT deleted.
 *
 * Name, favourite brand, budget, city etc.
 * can remain remembered.
 */
export const clearChatHistory = async (userId) => {
  const session = await Session.findOne({
    userId,
  });

  if (!session) {
    return null;
  }

  session.chatHistory = [];

  session.lastProducts = [];

  session.searchProducts = [];

  session.lastIntent = "";

  session.lastQuery = "";

  await session.save();

  return session;
};