import axios from "axios";

const BASE_URL = "https://quickart-jxc5.onrender.com/api/v1/chat";

/**
 * ==========================================
 * AUTH CONFIG
 * ==========================================
 */
const getAuthConfig = () => {
  const token = sessionStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * ==========================================
 * GET ALL CHATS
 * ==========================================
 *
 * GET /api/v1/chat
 *
 * Sidebar:
 * - Today
 * - Yesterday
 * - Previous 7 Days
 */
export const getShoppingChats = async () => {
  try {
    const { data } = await axios.get(
      BASE_URL,
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.error(
      "Get Shopping Chats Error:",
      error
    );

    return {
      success: false,
      chats: [],
    };
  }
};

/**
 * ==========================================
 * CREATE NEW CHAT
 * ==========================================
 *
 * POST /api/v1/chat
 *
 * Returns:
 *
 * {
 *   success: true,
 *   chat: {
 *     _id,
 *     title,
 *     createdAt,
 *     updatedAt
 *   }
 * }
 */
export const createShoppingChat = async () => {
  try {
    const { data } = await axios.post(
      BASE_URL,
      {},
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.error(
      "Create Shopping Chat Error:",
      error
    );

    return {
      success: false,
      chat: null,
    };
  }
};

/**
 * ==========================================
 * SEND MESSAGE
 * ==========================================
 *
 * POST /api/v1/chat/:chatId
 *
 * signal is used by AbortController
 * for the Stop Generation button.
 */
export const askShoppingAI = async (
  chatId,
  message,
  signal
) => {
  try {
    if (!chatId) {
      throw new Error(
        "chatId is required"
      );
    }

    const { data } = await axios.post(
      `${BASE_URL}/${chatId}`,
      {
        message,
      },
      {
        ...getAuthConfig(),
        signal,
      }
    );

    return data;
  } catch (error) {
    /**
     * User clicked Stop Generation
     */
    if (
      error.code === "ERR_CANCELED" ||
      error.name === "CanceledError"
    ) {
      throw error;
    }

    console.error(
      "Shopping AI Error:",
      error
    );

    return {
      success: false,

      answer:
        error.response?.data?.message ||
        "Something went wrong.",

      products: [],
      order: null,
    };
  }
};

/**
 * ==========================================
 * GET ONE CHAT HISTORY
 * ==========================================
 *
 * GET /api/v1/chat/:chatId/history
 *
 * Called when user clicks an old chat
 * from the sidebar.
 */
export const getShoppingChatHistory = async (
  chatId
) => {
  try {
    if (!chatId) {
      return {
        success: false,
        chat: null,
        history: [],
      };
    }

    const { data } = await axios.get(
      `${BASE_URL}/${chatId}/history`,
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.error(
      "Chat History Error:",
      error
    );

    return {
      success: false,
      chat: null,
      history: [],
    };
  }
};

/**
 * ==========================================
 * DELETE ONE CHAT
 * ==========================================
 *
 * DELETE /api/v1/chat/:chatId
 */
export const deleteShoppingChat = async (
  chatId
) => {
  try {
    if (!chatId) {
      return {
        success: false,
      };
    }

    const { data } = await axios.delete(
      `${BASE_URL}/${chatId}`,
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.error(
      "Delete Shopping Chat Error:",
      error
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to delete chat",
    };
  }
};