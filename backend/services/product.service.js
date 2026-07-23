import { retrieveRelevantProducts } from "./rag.service.js";

// Search products using RAG
export const searchProducts = async (message) => {
  const products = await retrieveRelevantProducts(message);

  return products;
};

// Compare products
export const compareProducts = async (message) => {
  const products = await retrieveRelevantProducts(message);

  return products;
};

// Recommend products
export const recommendProducts = async (message) => {
  const products = await retrieveRelevantProducts(message);

  return products;
};

// Product Details
export const getProductDetails = async (message) => {
  const products = await retrieveRelevantProducts(message);

  return products;
};