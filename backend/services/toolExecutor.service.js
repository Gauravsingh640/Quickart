import {
  searchProducts,
  compareProducts,
  recommendProducts,
  getProductDetails,
} from "./product.service.js";

export const executeTool = async (
  intent,
  message,
  userId,
  chatId = null
) => {
  let products = [];

  switch (intent) {
    // ==========================================
    // GENERAL CHAT
    // ==========================================

    case "GENERAL_CHAT":
      return {
        tool: "GENERAL_CHAT",
        products: [],
        order: null,
      };

    // ==========================================
    // SEARCH PRODUCT
    // ==========================================

    case "SEARCH_PRODUCT":
      products = await searchProducts(
        message,
        userId,
        chatId
      );
      break;

    // ==========================================
    // BUY NOW
    // ==========================================

    case "BUY_NOW":
      products = await recommendProducts(
        message,
        userId,
        chatId
      );
      break;

    // ==========================================
    // COMPARE
    // ==========================================

    case "COMPARE":
      products = await compareProducts(
        message,
        userId,
        chatId
      );
      break;

    // ==========================================
    // PRODUCT DETAILS
    // ==========================================

    case "PRODUCT_DETAILS":
      products = await getProductDetails(
        message,
        userId,
        chatId
      );
      break;

    // ==========================================
    // TRACK ORDER
    // ==========================================

    case "TRACK_ORDER":
      return {
        tool: "TRACK_ORDER",
        products: [],
        order: null,
      };

    // ==========================================
    // ORDER HISTORY
    // ==========================================

    case "ORDER_HISTORY":
      return {
        tool: "ORDER_HISTORY",
        products: [],
        order: null,
      };

    // ==========================================
    // CANCEL ORDER
    // ==========================================

    case "CANCEL_ORDER":
      return {
        tool: "CANCEL_ORDER",
        products: [],
        order: null,
      };

    // ==========================================
    // FALLBACK
    // ==========================================

    default:
      return {
        tool: "GENERAL_CHAT",
        products: [],
        order: null,
      };
  }

  return {
    tool: intent,
    products,
    order: null,
  };
};