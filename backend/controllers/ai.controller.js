import {
  generateSalesInsights,
  generateChatResponse,
} from "../services/ai.service.js";
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

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const answer = await generateChatResponse(question);

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