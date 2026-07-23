import { getAI } from "./groq.service.js";

import { SALES_PROMPT } from "../prompts/sales.prompt.js";
import { CHAT_PROMPT } from "../prompts/chat.prompt.js";

import {
  getOverviewAnalytics,
  getTopSellingProducts,
  getLowStockProducts,
  getMonthlySales,
} from "./analytics.service.js";

const groq = getAI();

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

    const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const generateChatResponse = async (
  question,
  memories = {}
) => {
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

    const memoryContext =
      Object.keys(memories).length > 0
        ? Object.entries(memories)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")
        : "No saved admin preferences.";

    const prompt = `
${CHAT_PROMPT}

=========================
KNOWN ADMIN INFORMATION
=========================

${memoryContext}

=========================
ANALYTICS DATA
=========================

${JSON.stringify(analytics, null, 2)}

=========================
QUESTION
=========================

${question}

Rules:

1. Use analytics only.
2. Use remembered admin preferences whenever relevant.
3. If reportFormat exists, use it.
4. If dashboardPreference exists, prioritize it.
5. Return only plain text.
`;

    const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.3,
});

return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error(error);
    throw error;
  }
};