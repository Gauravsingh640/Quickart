import express from "express";

import {
  chatWithAI,
  getChatHistory,
  getAllChats,
  createNewChat,
  deleteChat,
} from "../controllers/chatController.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

/**
 * ==========================================
 * SEND MESSAGE
 * ==========================================
 *
 * POST /api/v1/chat/:chatId
 *
 * Continue conversation inside a
 * particular chat.
 */
router.post(
  "/:chatId",
  isAuthenticated,
  chatWithAI
);

/**
 * ==========================================
 * GET ALL CHATS
 * ==========================================
 *
 * GET /api/v1/chat
 *
 * Used for sidebar:
 *
 * Today
 * Samsung vs Sony
 * Best laptops
 * ...
 */
router.get(
  "/",
  isAuthenticated,
  getAllChats
);

/**
 * ==========================================
 * CREATE NEW CHAT
 * ==========================================
 *
 * POST /api/v1/chat
 *
 * Creates a completely new conversation.
 */
router.post(
  "/",
  isAuthenticated,
  createNewChat
);

/**
 * ==========================================
 * GET SPECIFIC CHAT HISTORY
 * ==========================================
 *
 * GET /api/v1/chat/:chatId/history
 *
 * Used when user clicks an old chat
 * from the sidebar.
 */
router.get(
  "/:chatId/history",
  isAuthenticated,
  getChatHistory
);

/**
 * ==========================================
 * DELETE CHAT
 * ==========================================
 *
 * DELETE /api/v1/chat/:chatId
 */
router.delete(
  "/:chatId",
  isAuthenticated,
  deleteChat
);

export default router;