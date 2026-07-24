import axios from "axios";

const BASE_URL = "https://quickart-jxc5.onrender.com/api/v1/chat";

const getAuthConfig = () => {
  const token = sessionStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const askShoppingAI = async (message) => {
  try {
    const { data } = await axios.post(
      BASE_URL,
      { message },
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.error("Shopping AI Error:", error);

    return {
      success: false,
      answer: "Something went wrong.",
      products: [],
      order: null,
    };
  }
};

export const getShoppingChatHistory = async () => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/history`,
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.error("Chat History Error:", error);

    return {
      success: false,
      history: [],
    };
  }
};

export const clearShoppingChat = async () => {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/history`,
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.error("Clear Chat Error:", error);

    return {
      success: false,
    };
  }
};