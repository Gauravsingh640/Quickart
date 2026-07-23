import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/chat";

export const askShoppingAI = async (message) => {
  try {
    const token = sessionStorage.getItem("token");

    const { data } = await axios.post(
      BASE_URL,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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