import axios from "axios";

const api = axios.create({
  baseURL: "https://quickart-jxc5.onrender.com/api",
});

export const askAI = async (question) => {
  try {
    const token = sessionStorage.getItem("token");

    const { data } = await api.post(
      "/admin/ai/chat",
      { question },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Admin AI Error:", error);

    return {
      success: false,
      answer: "Something went wrong.",
    };
  }
};