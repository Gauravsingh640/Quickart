import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/chat";

const getAuthConfig = () => {
  const token = sessionStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const askShoppingAI = async (message, signal) => {
  try {
    const { data } = await axios.post(
      BASE_URL,
      { message },
      {
        ...getAuthConfig(),
        signal,
      }
    );

    return data;
  } catch (error) {
    // Request manually stopped
    if (
      error.code === "ERR_CANCELED" ||
      error.name === "CanceledError"
    ) {
      throw error;
    }

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