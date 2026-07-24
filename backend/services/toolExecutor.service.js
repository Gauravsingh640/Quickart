import {
  searchProducts,
  compareProducts,
  recommendProducts,
  getProductDetails,
} from "./product.service.js";

export const executeTool = async (
  intent,
  message,
  userId
) => {
  let products = [];

  switch (intent) {
    case "GENERAL_CHAT":
      return {
        tool: "GENERAL_CHAT",
        products: [],
        order: null,
      };

    case "SEARCH_PRODUCT":
      products = await searchProducts(
        message,
        userId
      );
      break;

    case "BUY_NOW":
      products = await recommendProducts(
        message,
        userId
      );
      break;

    case "COMPARE":
      products = await compareProducts(
        message,
        userId
      );
      break;

    case "PRODUCT_DETAILS":
      products = await getProductDetails(
        message,
        userId
      );
      break;

    case "TRACK_ORDER":
      return {
        tool: "TRACK_ORDER",
        products: [],
        order: null,
      };

    case "ORDER_HISTORY":
      return {
        tool: "ORDER_HISTORY",
        products: [],
        order: null,
      };

    case "CANCEL_ORDER":
      return {
        tool: "CANCEL_ORDER",
        products: [],
        order: null,
      };

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