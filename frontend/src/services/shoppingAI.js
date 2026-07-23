import axios from "axios";

const BASE_URL = "https://quickart-jxc5.onrender.com/api/v1/chat";

export const askShoppingAI = async (message) => {
  try {
    const { data } = await axios.post(
      BASE_URL,
      { message },
      {
        withCredentials: true,
      }
    );

    return data;
  } catch (error) {
    console.log(error);

    return {
      success: false,
      answer: "Something went wrong.",
      products: [],
      order: null,
    };
  }
};