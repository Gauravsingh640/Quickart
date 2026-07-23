import {
  generateSalesInsights,
  generateChatResponse,
} from "../services/ai.service.js";

import { extractMemory } from "../services/adminMemoryExtractor.service.js";
import { recallAll } from "../services/adminMemory.service.js";

export const getSalesInsights = async (req, res) => {
  try {
    const insights = await generateSalesInsights();

    return res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    let memories = {};

    if (req.user?._id) {
      await extractMemory(req.user._id, question);
      memories = await recallAll(req.user._id);
    }

    const answer = await generateChatResponse(question, memories);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};