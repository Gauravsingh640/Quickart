import { AdminChat } from "../models/adminChat.model.js";

// ==========================================
// CREATE CHAT
// ==========================================

export const createAdminChat = async (req, res) => {
  try {
    const chat = await AdminChat.create({
      userId: req.user._id,
      title: "New Chat",
      messages: [],
    });

    return res.status(201).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Create Admin Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create chat.",
    });
  }
};

// ==========================================
// GET ALL CHATS
// ==========================================

export const getAdminChats = async (req, res) => {
  try {
    const chats = await AdminChat.find({
      userId: req.user._id,
    })
      .select("_id title updatedAt")
      .sort({
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Get Admin Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chats.",
    });
  }
};

// ==========================================
// GET CHAT HISTORY
// ==========================================

export const getAdminChatHistory = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await AdminChat.findOne({
      _id: chatId,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    return res.status(200).json({
      success: true,
      history: chat.messages,
    });
  } catch (error) {
    console.error("Get Chat History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history.",
    });
  }
};

// ==========================================
// DELETE CHAT
// ==========================================

export const deleteAdminChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const deleted = await AdminChat.findOneAndDelete({
      _id: chatId,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete chat.",
    });
  }
};