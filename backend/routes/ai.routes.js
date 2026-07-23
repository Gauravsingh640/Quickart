import express from "express";
import {
  getSalesInsights,
  chatWithAI,
} from "../controllers/ai.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/insights", isAuthenticated, getSalesInsights);

router.post("/chat", isAuthenticated, chatWithAI);

export default router;