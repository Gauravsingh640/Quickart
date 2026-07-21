import { getAI } from "./gemini.service.js";

import { SALES_PROMPT } from "../prompts/sales.prompt.js";
import { CHAT_PROMPT } from "../prompts/chat.prompt.js";

import {
  getOverviewAnalytics,
  getTopSellingProducts,
  getLowStockProducts,
  getMonthlySales,
} from "./analytics.service.js";
const ai=getAI();
export const generateSalesInsights = async () => {
  try {
    const [
      overview,
      topProducts,
      lowStock,
      monthlySales,
    ] = await Promise.all([
      getOverviewAnalytics(),
      getTopSellingProducts(),
      getLowStockProducts(),
      getMonthlySales(),
    ]);

    const analytics = {
      overview,
      topProducts,
      lowStock,
      monthlySales,
    };

    const prompt = `
${SALES_PROMPT}

Analytics Data:

${JSON.stringify(analytics, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    return JSON.parse(text);

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

export const generateChatResponse = async (question) => {
  try {
    const [
      overview,
      topProducts,
      lowStock,
      monthlySales,
    ] = await Promise.all([
      getOverviewAnalytics(),
      getTopSellingProducts(),
      getLowStockProducts(),
      getMonthlySales(),
    ]);

    const analytics = {
      overview,
      topProducts,
      lowStock,
      monthlySales,
    };

    const prompt = `
${CHAT_PROMPT}

Analytics Data:
${JSON.stringify(analytics, null, 2)}

User Question:
${question}

Return ONLY plain text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    return response.text.trim();

  } catch (error) {
    console.error("AI Chat Error:", error);
    throw error;
  }
};