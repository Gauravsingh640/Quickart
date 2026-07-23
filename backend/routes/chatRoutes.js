import express from "express";
import { chatWithAI } from "../controllers/chatController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, chatWithAI);

export default router;   