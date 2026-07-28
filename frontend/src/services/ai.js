import axios from "axios";

const api = axios.create({
  baseURL: "https://quickart-jxc5.onrender.com/api",
});

const getAuthConfig = (signal) => ({
  signal,
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});

// ==========================================
// ASK AI
// ==========================================

export const askAI = async (
  chatId,
  question,
  signal
) => {
  const { data } = await api.post(
    "/admin/ai/chat",
    {
      chatId,
      question,
    },
    getAuthConfig(signal)
  );

  return data;
};

// ==========================================
// CREATE CHAT
// ==========================================

export const createAdminChat = async () => {
  const { data } = await api.post(
    "/admin/ai/chats",
    {},
    getAuthConfig()
  );

  return data;
};

// ==========================================
// GET CHATS
// ==========================================

export const getAdminChats = async () => {
  const { data } = await api.get(
    "/admin/ai/chats",
    getAuthConfig()
  );

  return data;
};

// ==========================================
// GET CHAT HISTORY
// ==========================================

export const getAdminChatHistory = async (
  chatId
) => {
  const { data } = await api.get(
    `/admin/ai/chats/${chatId}`,
    getAuthConfig()
  );

  return data;
};

// ==========================================
// DELETE CHAT
// ==========================================

export const deleteAdminChat = async (
  chatId
) => {
  const { data } = await api.delete(
    `/admin/ai/chats/${chatId}`,
    getAuthConfig()
  );

  return data;
};

// ==========================================
// ADD PRODUCT STOCK
// ==========================================

export const addProductStock = async (
  productId,
  quantity
) => {

  const { data } = await api.patch(
    `/v1/admin/products/${productId}/add-stock`,
    {
      quantity,
    },
    getAuthConfig()
  );

  return data;
};