import { Product } from "../models/productModel.js";
import { generateEmbedding } from "./embedding.service.js";
import { recallAll } from "./userMemory.service.js";

// ==========================================
// CATEGORY
// ==========================================

const detectCategory = (query) => {
  const text = query.toLowerCase();

  if (
    /\b(laptop|laptops|notebook|notebooks|macbook|macbooks|gaming laptop|gaming laptops)\b/i.test(
      text
    )
  ) {
    return "Laptop";
  }

  if (
    /\b(phone|phones|smartphone|smartphones|mobile|mobiles|iphone|iphones|android|android phone|android phones)\b/i.test(
      text
    )
  ) {
    return "Mobile";
  }

  if (
    /\b(headphone|headphones|headset|headsets|earphone|earphones|earbud|earbuds|airpod|airpods|buds)\b/i.test(
      text
    )
  ) {
    return "Headphone";
  }

  return null;
};

// ==========================================
// BRAND
// ==========================================

const detectBrand = (query) => {
  const text = query.toLowerCase();

  if (
    /\b(apple|iphone|iphones|macbook|macbooks|airpod|airpods)\b/i.test(
      text
    )
  ) {
    return "Apple";
  }

  if (/\b(oneplus|one plus)\b/i.test(text))
    return "OnePlus";

  if (/\b(samsung|galaxy)\b/i.test(text))
    return "Samsung";

  if (/\bdell\b/i.test(text))
    return "Dell";

  if (/\bhp\b/i.test(text))
    return "HP";

  if (/\basus\b/i.test(text))
    return "Asus";

  if (/\blenovo\b/i.test(text))
    return "Lenovo";

  if (/\bacer\b/i.test(text))
    return "Acer";

  if (/\bboat\b/i.test(text))
    return "Boat";

  if (/\bsony\b/i.test(text))
    return "Sony";

  return null;
};

// ==========================================
// BUDGET
// ==========================================

const extractBudget = (query) => {
  const match = query.match(
    /(?:under|below|less than|upto|up to|max|maximum)\s*₹?\s*([\d,]+)/i
  );

  if (!match) return null;

  const budget = Number(
    match[1].replace(/,/g, "")
  );

  return Number.isNaN(budget)
    ? null
    : budget;
};

// ==========================================
// USER ASKING FOR HIS/HER PREFERENCE?
// ==========================================

const isPreferenceQuery = (query) => {
  return /\b(that i like|i like|my favourite|my favorite|my preferred|i prefer|according to my preference|according to my choice)\b/i.test(
    query
  );
};

// ==========================================
// USER ASKING ALL PRODUCTS?
// ==========================================

const isAllQuery = (query) => {
  return /\b(all|show all|every|all available)\b/i.test(
    query
  );
};

// ==========================================
// MEMORY HELPERS
// ==========================================

const getFavoriteBrandForCategory = (
  category,
  memories
) => {
  switch (category) {
    case "Laptop":
      return memories.favoriteLaptopBrand || null;

    case "Mobile":
      return memories.favoriteMobileBrand || null;

    case "Headphone":
      return memories.favoriteHeadphoneBrand || null;

    default:
      return memories.favoriteBrand || null;
  }
};

const getDislikedBrandsForCategory = (
  category,
  memories
) => {
  let value = [];

  switch (category) {
    case "Laptop":
      value =
        memories.dislikedLaptopBrands || [];
      break;

    case "Mobile":
      value =
        memories.dislikedMobileBrands || [];
      break;

    case "Headphone":
      value =
        memories.dislikedHeadphoneBrands || [];
      break;

    default:
      value = [];
  }

  return Array.isArray(value)
    ? value
    : [];
};

// ==========================================
// MAIN RAG
// ==========================================

export const retrieveRelevantProducts = async (
  query,
  userId = null
) => {
  try {
    if (!query?.trim()) {
      return [];
    }

    const category =
      detectCategory(query);

    // Explicit brand in CURRENT query
    const explicitBrand =
      detectBrand(query);

    const budget =
      extractBudget(query);

    const preferenceQuery =
      isPreferenceQuery(query);

    const allQuery =
      isAllQuery(query);

    // ==========================================
    // LOAD USER MEMORY
    // ==========================================

    let memories = {};

    if (userId) {
      memories =
        await recallAll(userId);
    }

    const favoriteBrand =
      getFavoriteBrandForCategory(
        category,
        memories
      );

    const dislikedBrands =
      getDislikedBrandsForCategory(
        category,
        memories
      );

    console.log("================================");
    console.log("RAG Query:", query);
    console.log("Category:", category);
    console.log(
      "Explicit Brand:",
      explicitBrand
    );
    console.log(
      "Favorite Brand:",
      favoriteBrand
    );
    console.log(
      "Disliked Brands:",
      dislikedBrands
    );
    console.log(
      "Preference Query:",
      preferenceQuery
    );
    console.log(
      "Show All:",
      allQuery
    );
    console.log("Budget:", budget);
    console.log("================================");

    // ==========================================
    // DETERMINE BRAND FILTER
    // ==========================================

    let requiredBrand = null;

    /*
     * Highest priority:
     *
     * "show Dell laptops"
     *
     * Even if Dell is disliked,
     * user explicitly requested Dell.
     */
    if (explicitBrand) {
      requiredBrand =
        explicitBrand;
    }

    /*
     * "show laptops that I like"
     *
     * No explicit brand mentioned,
     * therefore use saved favourite.
     */
    else if (
      preferenceQuery &&
      favoriteBrand
    ) {
      requiredBrand =
        favoriteBrand;
    }

    // ==========================================
    // GENERATE EMBEDDING
    // ==========================================

    const queryEmbedding =
      await generateEmbedding(query);

    // ==========================================
    // VECTOR SEARCH
    // ==========================================

    let products =
      await Product.aggregate([
        {
          $vectorSearch: {
            index:
              "product_vector_index",

            path: "embedding",

            queryVector:
              queryEmbedding,

            numCandidates: 200,

            limit: 50,
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
              $meta:
                "vectorSearchScore",
            },
          },
        },
      ]);

    // ==========================================
    // CATEGORY FILTER
    // ==========================================

    if (category) {
      products =
        products.filter(
          (product) =>
            product.category
              ?.trim()
              .toLowerCase() ===
            category
              .toLowerCase()
        );
    }

    // ==========================================
    // REQUIRED BRAND
    // ==========================================

    if (requiredBrand) {
      products =
        products.filter(
          (product) =>
            product.brand
              ?.trim()
              .toLowerCase() ===
            requiredBrand
              .toLowerCase()
        );
    }

    // ==========================================
    // DISLIKED BRANDS
    // ==========================================
    //
    // Only exclude dislikes when user has NOT
    // explicitly requested that brand.
    //
    // "show all laptops"
    // -> Dell removed
    //
    // "show Dell laptops"
    // -> Dell allowed
    // ==========================================

    if (
      !explicitBrand &&
      dislikedBrands.length > 0
    ) {
      const dislikedSet =
        new Set(
          dislikedBrands.map(
            (brand) =>
              brand
                .trim()
                .toLowerCase()
          )
        );

      products =
        products.filter(
          (product) =>
            !dislikedSet.has(
              product.brand
                ?.trim()
                .toLowerCase()
            )
        );
    }

    // ==========================================
    // BUDGET
    // ==========================================

    if (budget !== null) {
      products =
        products.filter(
          (product) =>
            Number(product.price) <=
            budget
        );
    }

    // ==========================================
    // STOCK
    // ==========================================

    products =
      products.filter(
        (product) =>
          Number(product.stock) > 0
      );

    // ==========================================
    // SIMILARITY
    // ==========================================

    /*
     * For hard-filtered requests,
     * category/brand matters more.
     */

    if (
      !category &&
      !requiredBrand
    ) {
      products =
        products.filter(
          (product) =>
            Number(product.score) >=
            0.5
        );
    } else {
      products =
        products.filter(
          (product) =>
            Number(product.score) >=
            0.35
        );
    }

    // ==========================================
    // SORT
    // ==========================================

    products.sort(
      (a, b) =>
        Number(b.score) -
        Number(a.score)
    );

    // ==========================================
    // LIMIT
    // ==========================================

    /*
     * Your UI currently works with max 5.
     *
     * "show all" can be changed later
     * if you want pagination.
     */

    products =
      products.slice(0, 5);

    console.log(
      "Final Products:",
      products.map(
        (product) => ({
          name: product.name,
          brand: product.brand,
          category:
            product.category,
          price: product.price,
          score: product.score,
        })
      )
    );

    return products;
  } catch (error) {
    console.error(
      "Vector Search Error:",
      error
    );

    throw error;
  }
};