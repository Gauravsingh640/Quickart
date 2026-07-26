import { classifyIntent } from "../services/intentClassifier.service.js";
import { createPlan } from "../services/planner.service.js";
import { executeTool } from "../services/toolExecutor.service.js";
import { buildShoppingPrompt } from "../services/prompt.service.js";
import { generateResponse } from "../services/groq.service.js";

import { extractMemory } from "../services/userMemoryExtractor.service.js";
import { recallAll } from "../services/userMemory.service.js";

import {
  createSession,
  getSession,
  getUserChats,
  saveConversation,
  saveAIResponse,
  getRecentHistory,
  getFullChatHistory,
  deleteChat as deleteChatService,
} from "../services/memory.service.js";

/**
 * ==========================================
 * SEND MESSAGE / CONTINUE EXISTING CHAT
 * ==========================================
 *
 * POST /api/v1/chat/:chatId
 */
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const { chatId } = req.params;

    const userId = req.user?._id;

    // ==========================================
    // AUTH CHECK
    // ==========================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ==========================================
    // MESSAGE CHECK
    // ==========================================

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // ==========================================
    // GET CURRENT CHAT
    // ==========================================

    const session = await getSession(
      userId,
      chatId
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const currentChatId =
      session._id.toString();

    console.log(
      "================================"
    );

    console.log(
      "User:",
      userId.toString()
    );

    console.log(
      "Chat:",
      currentChatId
    );

    console.log(
      "Message:",
      message
    );

    console.log(
      "================================"
    );

    // ==========================================
    // STEP 1: EXTRACT LONG-TERM MEMORY
    // ==========================================

    await extractMemory(
      userId,
      message
    );

    // ==========================================
    // STEP 2: CLASSIFY INTENT
    // ==========================================

    const intent =
      await classifyIntent(message);

    console.log(
      "Intent:",
      intent
    );

    // ==========================================
    // STEP 3: CREATE PLAN
    // ==========================================

    const plan = createPlan(
      intent,
      message
    );

    // ==========================================
    // STEP 4: EXECUTE TOOLS
    // ==========================================

    let toolResult = {
      products: [],
      order: null,
    };

    for (const step of plan) {
      toolResult = await executeTool(
        step.tool,
        step.input || message,
        userId,
        currentChatId
      );
    }

    const products =
      toolResult?.products || [];

    const order =
      toolResult?.order || null;

    console.log(
      "Products:",
      products.map(
        (product) => product.name
      )
    );

    // ==========================================
    // STEP 5: SAVE USER MESSAGE
    // ==========================================

    await saveConversation(
      userId,
      currentChatId,
      intent,
      message,
      products
    );

    // ==========================================
    // STEP 6: LOAD CURRENT CHAT HISTORY
    // ==========================================

    const history =
      await getRecentHistory(
        userId,
        currentChatId
      );

    // ==========================================
    // STEP 7: LOAD LONG-TERM MEMORY
    // ==========================================

    const memories =
      await recallAll(userId);

    // ==========================================
    // STEP 8: HANDLE NO PRODUCT FOUND
    // ==========================================

    const productIntents = [
      "SEARCH_PRODUCT",
      "COMPARE",
      "BUY_NOW",
      "PRODUCT_DETAILS",
    ];

    if (
      productIntents.includes(intent) &&
      products.length === 0
    ) {
      const answer =
        "Sorry, Quickart currently doesn't have a suitable product matching your request.";

      await saveAIResponse(
        userId,
        currentChatId,
        answer,
        []
      );

      return res.status(200).json({
        success: true,
        chatId: currentChatId,
        answer,
        products: [],
        order: null,
      });
    }

    // ==========================================
    // STEP 9: BUILD PROMPT
    // ==========================================

    const prompt =
      buildShoppingPrompt(
        message,
        products,
        order,
        intent,
        history,
        memories
      );

    // ==========================================
    // STEP 10: GENERATE AI RESPONSE
    // ==========================================

    const answer =
      await generateResponse(prompt);

    // ==========================================
    // STEP 11: SAVE AI RESPONSE
    // ==========================================

    await saveAIResponse(
      userId,
      currentChatId,
      answer,
      products
    );

    // ==========================================
    // STEP 12: SEND RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      chatId: currentChatId,
      answer,
      products,
      order,
    });
  } catch (error) {
    console.error(
      "AI Chat Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
};

/**
 * ==========================================
 * GET ALL USER CHATS
 * ==========================================
 *
 * GET /api/v1/chat
 *
 * Used by sidebar.
 */
export const getAllChats = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const chats =
      await getUserChats(userId);

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error(
      "Get All Chats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to load chats",
    });
  }
};

/**
 * ==========================================
 * CREATE NEW CHAT
 * ==========================================
 *
 * POST /api/v1/chat
 */
export const createNewChat = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const session =
      await createSession(userId);

    return res.status(201).json({
      success: true,

      chat: {
        _id: session._id,
        title:
          session.title ||
          "New Chat",
        createdAt:
          session.createdAt,
        updatedAt:
          session.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Create New Chat Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create chat",
    });
  }
};

/**
 * ==========================================
 * GET SPECIFIC CHAT HISTORY
 * ==========================================
 *
 * GET /api/v1/chat/:chatId/history
 */
export const getChatHistory = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id;
    const { chatId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const session =
      await getSession(
        userId,
        chatId
      );

    // Prevent another user from
    // accessing this conversation.
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const history =
      await getFullChatHistory(
        userId,
        chatId
      );

    return res.status(200).json({
      success: true,

      chat: {
        _id: session._id,

        title:
          session.title ||
          "New Chat",

        createdAt:
          session.createdAt,

        updatedAt:
          session.updatedAt,
      },

      history,
    });
  } catch (error) {
    console.error(
      "Get Chat History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to load chat history",
    });
  }
};

/**
 * ==========================================
 * DELETE SPECIFIC CHAT
 * ==========================================
 *
 * DELETE /api/v1/chat/:chatId
 */
export const deleteChat = async (
  req,
  res
) => {
  try {
    const userId = req.user?._id;
    const { chatId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deleted =
      await deleteChatService(
        userId,
        chatId
      );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Chat deleted successfully",
      chatId,
    });
  } catch (error) {
    console.error(
      "Delete Chat Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete chat",
    });
  }
};