import {
  searchProducts,
  compareProducts,
  recommendProducts,
  getProductDetails,
} from "./product.service.js";

export const executeTool = async (intent, message) => {
  let products = [];

  switch (intent) {
    case "SEARCH_PRODUCT":
      products = await searchProducts(message);
      break;

    case "ADD_TO_CART":
      products = await searchProducts(message);
      break;

    case "BUY_NOW":
      products = await recommendProducts(message);
      break;

    case "COMPARE":
      products = await compareProducts(message);
      break;

    case "PRODUCT_DETAILS":
      products = await getProductDetails(message);
      break;

    case "REMOVE_FROM_CART":
      return {
        tool: "REMOVE_FROM_CART",
        products: [],
      };

    default:
      products = await searchProducts(message);
      intent = "SEARCH_PRODUCT";
      break;
  }

  return {
    tool: intent,
    products,
  };
};