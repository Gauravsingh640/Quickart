import express from "express";

import {
  chatWithAI,
  getChatHistory,
  clearChat,
} from "../controllers/chatController.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, chatWithAI);

// Load existing conversation
router.get("/history", isAuthenticated, getChatHistory);

// Start new conversation
router.delete("/history", isAuthenticated, clearChat);

export default router;