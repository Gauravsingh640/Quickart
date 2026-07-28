import express from "express";

import {
  chatWithAI,
} from "../controllers/ai.controller.js";

import {
  createAdminChat,
  getAdminChats,
  getAdminChatHistory,
  deleteAdminChat,
} from "../controllers/adminChat.controller.js";

import {
  isAuthenticated,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// ==========================================
// CHAT CRUD
// ==========================================

router.post(
  "/chats",
  isAuthenticated,
  createAdminChat
);

router.get(
  "/chats",
  isAuthenticated,
  getAdminChats
);

router.get(
  "/chats/:chatId",
  isAuthenticated,
  getAdminChatHistory
);

router.delete(
  "/chats/:chatId",
  isAuthenticated,
  deleteAdminChat
);

// ==========================================
// AI CHAT
// ==========================================

router.post(
  "/chat",
  isAuthenticated,
  chatWithAI
);

export default router;