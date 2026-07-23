import { Product } from "../models/productModel.js";
import { generateEmbedding } from "./embedding.service.js";

export const retrieveRelevantProducts = async (query) => {
  try {
    // Generate embedding for user query
    const queryEmbedding = await generateEmbedding(query);

    // Extract budget from user query
    let budget = null;

    const budgetMatch = query.match(
      /(?:under|below|less than)\s*₹?\s*(\d+)/i
    );

    if (budgetMatch) {
      budget = Number(budgetMatch[1]);
    }

    // MongoDB Vector Search
    let products = await Product.aggregate([
      {
        $vectorSearch: {
          index: "product_vector_index", // Atlas index name
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 10,
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          stock: 1,
          brand: 1,
          category: 1,
          description: 1,
          images: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    // Remove weak matches
    products = products.filter(
      (product) => product.score >= 0.65
    );

    // Apply budget filter if user specified one
    if (budget !== null) {
      products = products.filter(
        (product) => product.price <= budget
      );
    }

    // Return maximum 5 products
    return products.slice(0, 5);
  } catch (error) {
    console.error("Vector Search Error:", error);
    throw error;
  }
};