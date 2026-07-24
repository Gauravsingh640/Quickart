import { classifyIntent } from "../services/intentClassifier.service.js";
import { createPlan } from "../services/planner.service.js";
import { executeTool } from "../services/toolExecutor.service.js";
import { buildShoppingPrompt } from "../services/prompt.service.js";
import { generateResponse } from "../services/groq.service.js";

import { extractMemory } from "../services/userMemoryExtractor.service.js";
import { recallAll } from "../services/userMemory.service.js";

import {
  saveConversation,
  saveAIResponse,
  getRecentHistory,
  getFullChatHistory,
  clearChatHistory,
} from "../services/memory.service.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Step 0: Extract & Save Long-Term Memory
    console.log("Logged User:", req.user);
    console.log("User ID:", req.user?._id);
    if (req.user?._id) {
      await extractMemory(req.user._id, message);
    }

    // Step 1: Detect Intent
    const intent = await classifyIntent(message);
    console.log("Intent:", intent);

    // Step 2: Create Execution Plan
    const plan = createPlan(intent, message);

    let toolResult = {};

    // Step 3: Execute Required Tools
    for (const step of plan) {
      toolResult = await executeTool(
        step.tool,
        step.input || message,
        req.user?._id
      );
    }

    const products = toolResult.products || [];
    const order = toolResult.order || null;

    // Step 4: Save Current Conversation (Short-Term Memory)
    if (req.user?._id) {
      await saveConversation(
        req.user._id,
        intent,
        message,
        products
      );
    }

    // Step 5: Load Recent Conversation History
    let history = [];

    if (req.user?._id) {
      history = await getRecentHistory(req.user._id);
    }

    // Step 6: Load Long-Term Memory
    let memories = {};

    if (req.user?._id) {
      memories = await recallAll(req.user._id);
    }

    // Step 7: Handle No Product Found
    if (
      ["SEARCH_PRODUCT", "COMPARE", "BUY_NOW", "PRODUCT_DETAILS"].includes(
        intent
      ) &&
      products.length === 0
    ) {
      return res.status(200).json({
        success: true,
        answer:
          "Sorry, Quickart currently doesn't have a suitable product matching your request.",
        products: [],
      });
    }

    // Step 8: Build Prompt
    const prompt = buildShoppingPrompt(
      message,
      products,
      order,
      intent,
      history,
      memories
    );

    // Step 9: Generate AI Response
    const answer = await generateResponse(prompt);

    // Step 10: Save AI Response in Conversation History
    if (req.user?._id) {
      await saveAIResponse(req.user._id, answer, products);
    }

    return res.status(200).json({
      success: true,
      answer,
      products,
      order,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const history = await getFullChatHistory(req.user._id);

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Get Chat History Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load chat history",
    });
  }
};

export const clearChat = async (req, res) => {
  try {
    await clearChatHistory(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Chat cleared successfully",
    });
  } catch (error) {
    console.error("Clear Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to clear chat",
    });
  }
};