import { generateResponse } from "./gemini.service.js";

export const decideTool = async (message) => {
  const prompt = `
You are a shopping AI planner.

Available tools:

1. SEARCH_PRODUCT
2. PRODUCT_DETAILS
3. COMPARE
4. BUY_NOW
5. TRACK_ORDER
6. ORDER_HISTORY
7. CANCEL_ORDER

Return ONLY JSON.

Example:

{
"tool":"SEARCH_PRODUCT",
"query":"gaming laptop under 70000"
}

User:

${message}
`;

  const response = await generateResponse(prompt);

  try {
    return JSON.parse(response);
  } catch {
    return {
      tool: "SEARCH_PRODUCT",
      query: message,
    };
  }
};