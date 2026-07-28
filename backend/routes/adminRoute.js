import express from "express";

import {
  chatWithAI,
} from "../controllers/ai.controller.js";

import {
  getAdminStats,
  addProductStock,
} from "../controllers/adminController.js";

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

router.get(
  "/stats",
  getAdminStats
);

router.patch(
  "/products/:id/add-stock",
  isAuthenticated,
  addProductStock
);

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