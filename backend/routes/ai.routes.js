import express from "express";
import {
  getSalesInsights,
  chatWithAI,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/insights", getSalesInsights);

router.post("/chat", chatWithAI);

export default router;