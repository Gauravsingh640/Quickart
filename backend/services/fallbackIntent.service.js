import { detectIntent } from "./intent.service.js";

const VALID_INTENTS = [
  "SEARCH_PRODUCT",
  "COMPARE",
  "BUY_NOW",
  "PRODUCT_DETAILS",
  "TRACK_ORDER",
  "ORDER_HISTORY",
  "CANCEL_ORDER",
];

export const getIntent = async (message) => {
  try {
    const aiIntent = await classifyIntent(message);

    if (VALID_INTENTS.includes(aiIntent))
      return aiIntent;

    return detectIntent(message);
  } catch {
    return detectIntent(message);
  }
};