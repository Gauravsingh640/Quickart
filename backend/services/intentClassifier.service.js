import { generateResponse } from "./gemini.service.js";

export const classifyIntent = async (message) => {
  const prompt = `
You are an intent classification system.

Return ONLY one of these values.

SEARCH_PRODUCT
COMPARE
BUY_NOW
PRODUCT_DETAILS
TRACK_ORDER
ORDER_HISTORY
CANCEL_ORDER

User Message:
"${message}"

Return ONLY the intent.
`;

  const intent = await generateResponse(prompt);

  return intent.trim().toUpperCase();
};