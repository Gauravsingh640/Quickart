// controllers/ai.controller.js

import {
  generateAdminAIResponse,
} from "../services/adminAI.service.js";

import {
  extractMemory,
} from "../services/adminMemoryExtractor.service.js";

import {
  recallAll,
} from "../services/adminMemory.service.js";

import { AdminChat } from "../models/adminChat.model.js";

// ==========================================
// ADMIN AI CHAT
// ==========================================

export const chatWithAI = async (
  req,
  res
) => {

  try {

    // ========================================
    // 1. GET QUESTION
    // ========================================
    
    const {
      question,
      chatId,
    } = req.body;


    // ========================================
    // 2. VALIDATE QUESTION
    // ========================================

    if (
      typeof question !== "string" ||
      !question.trim()
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Question is required.",
      });
    }


    const cleanQuestion =
      question.trim();
    let chat = null;

    if (chatId) {
      chat = await AdminChat.findOne({
        _id: chatId,
        userId: req.user._id,
      });

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat not found.",
        });
      }
    } else {
      chat = await AdminChat.create({
        userId: req.user._id,
        title: "New Chat",
        messages: [],
      });
    }


    // ========================================
    // 3. LOAD ADMIN MEMORY
    // ========================================

    let memories = {};


    if (req.user?._id) {

      try {

        // ------------------------------------
        // Extract memory from current message
        // ------------------------------------

        await extractMemory(
          req.user._id,
          cleanQuestion
        );


        // ------------------------------------
        // Recall saved preferences
        // ------------------------------------

        memories =
          await recallAll(
            req.user._id
          );

      } catch (memoryError) {

        console.error(
          "Admin Memory Error:",
          memoryError
        );

        // Memory is optional.
        // Continue without memories.

        memories = {};
      }
    }


    // ========================================
    // 4. GENERATE AI RESPONSE
    // ========================================

    const result =
      await generateAdminAIResponse(
        cleanQuestion,
        memories
      );
    if (chat) {
      chat.messages.push({
        role: "user",
        message: cleanQuestion,
      });

      chat.messages.push({
        role: "assistant",
        message: result.answer,
      });

      if (
        chat.title === "New Chat" &&
        chat.messages.length === 2
      ) {
        chat.title =
          cleanQuestion.length > 50
            ? cleanQuestion.slice(0, 47).trimEnd() + "..."
            : cleanQuestion;
      }

      await chat.save();
    }


    // ========================================
    // 5. SUCCESS RESPONSE
    // ========================================

    return res.status(200).json({

      success: true,

      chatId: chat?._id,

      intent:
        result.intent,

      tool:
        result.tool,

      answer:
        result.answer,

      data:
        result.data,
    });

  } catch (error) {

    console.error(
      "Admin AI Controller Error:",
      error
    );


    // ========================================
    // GROQ RATE LIMIT
    // ========================================

    if (
      error?.status === 429
    ) {

      return res.status(429).json({

        success: false,

        message:
          error.message ||
          "AI service is temporarily busy. Please try again shortly.",
      });
    }


    // ========================================
    // INTERNAL SERVER ERROR
    // ========================================

    return res.status(500).json({

      success: false,

      message:
        "Failed to process AI request.",
    });
  }
};