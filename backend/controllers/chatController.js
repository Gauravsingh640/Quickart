import { classifyIntent } from "../services/intentClassifier.service.js";
import { createPlan } from "../services/planner.service.js";
import { executeTool } from "../services/toolExecutor.service.js";
import { buildShoppingPrompt } from "../services/prompt.service.js";
import { generateResponse } from "../services/gemini.service.js";
import {
  saveConversation,
  saveAIResponse,
  getRecentHistory,
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

    // Step 1: Detect Intent
    const intent = await classifyIntent(message);
    console.log("Intent:", intent);

    // Step 2: Create Plan
    const plan = createPlan(intent, message);

    let toolResult = {};

    // Step 3: Execute Plan
    for (const step of plan) {
      toolResult = await executeTool(
        step.tool,
        step.input || message,
        req.user?._id
      );
    }

    const products = toolResult.products || [];
    const order = toolResult.order || null;

    // Step 4: Save User Message
    if (req.user?._id) {
      await saveConversation(
        req.user._id,
        intent,
        message,
        products
      );
    }

    // Step 5: Get Previous History
    let history = [];

    if (req.user?._id) {
      history = await getRecentHistory(req.user._id);
    }

    // Step 6: Handle No Products
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

    // Step 7: Build Prompt
    const prompt = buildShoppingPrompt(
      message,
      products,
      order,
      intent,
      history
    );

    // Step 8: Generate AI Response
    const answer = await generateResponse(prompt);

    // Step 9: Save AI Response
    if (req.user?._id) {
      await saveAIResponse(req.user._id, answer);
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