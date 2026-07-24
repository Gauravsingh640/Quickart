import { retrieveRelevantProducts } from "./rag.service.js";

import {
  getLastProducts,
  getSearchProducts,
} from "./memory.service.js";

/**
 * ==========================================
 * NORMAL PRODUCT SEARCH
 * ==========================================
 *
 * Handles:
 * - category
 * - brand
 * - budget
 * - favourite preference
 * - disliked brands
 *
 * Examples:
 *
 * "show laptops"
 * "show all laptops"
 * "show Dell laptops"
 * "show laptops that I like"
 * "phones under 30000"
 */
export const searchProducts = async (
  message,
  userId = null
) => {
  return await retrieveRelevantProducts(
    message,
    userId
  );
};

/**
 * ==========================================
 * COMPARE PRODUCTS
 * ==========================================
 */
export const compareProducts = async (
  message,
  userId = null
) => {
  return await retrieveRelevantProducts(
    message,
    userId
  );
};

/**
 * ==========================================
 * RECOMMEND PRODUCTS
 * ==========================================
 */
export const recommendProducts = async (
  message,
  userId = null
) => {
  return await retrieveRelevantProducts(
    message,
    userId
  );
};

/**
 * ==========================================
 * PRODUCT DETAILS / FOLLOW-UP
 * ==========================================
 *
 * Handles:
 *
 * "tell me about first one"
 * "tell me about second one"
 * "tell me about Dell G15"
 * "HP wale batao"
 * "tell me about OnePlus 13"
 *
 * It first checks previously displayed products.
 *
 * If no previous product matches,
 * it falls back to RAG.
 */
export const getProductDetails = async (
  message,
  userId = null
) => {
  // ==========================================
  // No authenticated user
  // ==========================================

  if (!userId) {
    return await retrieveRelevantProducts(
      message,
      null
    );
  }

  // ==========================================
  // Load previous products
  // ==========================================

  const lastProducts =
    await getLastProducts(userId);

  const originalSearchProducts =
    await getSearchProducts(userId);

  const text = message
    .toLowerCase()
    .trim();

  console.log(
    "Last Products:",
    lastProducts.map((p) => p.name)
  );

  console.log(
    "Original Search Products:",
    originalSearchProducts.map(
      (p) => p.name
    )
  );

  // ==========================================
  // 1. POSITION REFERENCE
  // ==========================================
  //
  // "first one"
  // "second one"
  // "tell me about third one"
  //
  // Position always refers to products from
  // immediately previous response.
  // ==========================================

  const positions = {
    first: 0,
    "1st": 0,

    second: 1,
    "2nd": 1,

    third: 2,
    "3rd": 2,

    fourth: 3,
    "4th": 3,

    fifth: 4,
    "5th": 4,
  };

  for (const [word, index] of Object.entries(
    positions
  )) {
    if (
      text.includes(word) &&
      lastProducts[index]
    ) {
      console.log(
        "Position Match:",
        lastProducts[index].name
      );

      return [lastProducts[index]];
    }
  }

  // ==========================================
  // LAST PRODUCT
  // ==========================================

  if (
    /\blast(?:\s+one|\s+product)?\b/i.test(
      text
    ) &&
    lastProducts.length > 0
  ) {
    const lastProduct =
      lastProducts[
        lastProducts.length - 1
      ];

    console.log(
      "Last Product Match:",
      lastProduct.name
    );

    return [lastProduct];
  }

  // ==========================================
  // 2. CREATE COMBINED PRODUCT POOL
  // ==========================================
  //
  // Example:
  //
  // Search:
  // Dell
  // HP
  // Asus
  //
  // Then user:
  // "tell me about Dell"
  //
  // Current lastProducts might become Dell only.
  //
  // But originalSearchProducts still contains:
  // Dell + HP + Asus
  //
  // Therefore later:
  // "tell me about HP"
  //
  // still works.
  // ==========================================

  const productMap = new Map();

  for (const product of [
    ...lastProducts,
    ...originalSearchProducts,
  ]) {
    if (!product?._id) continue;

    productMap.set(
      product._id.toString(),
      product
    );
  }

  const availableProducts = [
    ...productMap.values(),
  ];

  // ==========================================
  // If no previous products exist
  // ==========================================

  if (availableProducts.length === 0) {
    console.log(
      "No previous products. Using RAG."
    );

    return await retrieveRelevantProducts(
      message,
      userId
    );
  }

  // ==========================================
  // 3. EXACT PRODUCT NAME
  // ==========================================

  const exactProduct =
    availableProducts.find((product) => {
      const productName =
        product.name
          ?.toLowerCase()
          .trim();

      if (!productName) {
        return false;
      }

      return text.includes(productName);
    });

  if (exactProduct) {
    console.log(
      "Exact Product Match:",
      exactProduct.name
    );

    return [exactProduct];
  }

  // ==========================================
  // 4. BRAND MATCH
  // ==========================================
  //
  // Examples:
  //
  // "OnePlus wale batao"
  // → all OnePlus products from previous search
  //
  // "HP laptops ke bare mein batao"
  // → HP products
  //
  // IMPORTANT:
  // We return ALL matching products here,
  // not just first brand product.
  // ==========================================

  const brandMatches =
    availableProducts.filter((product) => {
      const brand =
        product.brand
          ?.toLowerCase()
          .trim();

      if (!brand) {
        return false;
      }

      return text.includes(brand);
    });

  if (brandMatches.length > 0) {
    console.log(
      "Brand Matches:",
      brandMatches.map(
        (product) => product.name
      )
    );

    return brandMatches;
  }

  // ==========================================
  // 5. PARTIAL PRODUCT NAME
  // ==========================================

  const ignoredWords = new Set([
    "tell",
    "me",
    "about",

    "this",
    "that",
    "these",
    "those",

    "the",
    "a",
    "an",

    "product",
    "products",

    "please",

    "show",

    "details",
    "detail",

    "laptop",
    "laptops",

    "notebook",
    "notebooks",

    "mobile",
    "mobiles",

    "phone",
    "phones",

    "smartphone",
    "smartphones",

    "headphone",
    "headphones",

    "earphone",
    "earphones",

    "earbud",
    "earbuds",

    "one",
    "ones",

    "wala",
    "wale",
    "wali",

    "batao",
    "bata",
    "bataiye",

    "ke",
    "ka",
    "ki",

    "bare",
    "mein",

    "more",
    "information",
    "info",
  ]);

  const queryWords = text
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(
      (word) =>
        word.length >= 2 &&
        !ignoredWords.has(word)
    );

  console.log(
    "Product Detail Query Words:",
    queryWords
  );

  let bestProduct = null;
  let bestScore = 0;

  for (const product of availableProducts) {
    const searchableText = `
      ${product.name || ""}
      ${product.brand || ""}
    `
      .toLowerCase()
      .replace(/[^\w\s]/g, " ");

    const score = queryWords.filter(
      (word) =>
        searchableText.includes(word)
    ).length;

    if (score > bestScore) {
      bestScore = score;
      bestProduct = product;
    }
  }

  if (
    bestProduct &&
    bestScore > 0
  ) {
    console.log(
      "Partial Product Match:",
      bestProduct.name,
      "Score:",
      bestScore
    );

    return [bestProduct];
  }

  // ==========================================
  // 6. "THIS PRODUCT" / "THAT PRODUCT"
  // ==========================================
  //
  // If only ONE product was displayed:
  //
  // "tell me about this product"
  //
  // → return that product.
  // ==========================================

  const genericReference =
    /\b(this|that)\s+(product|one|laptop|phone|mobile|headphone)\b/i.test(
      text
    );

  if (
    genericReference &&
    lastProducts.length === 1
  ) {
    console.log(
      "Generic Reference Match:",
      lastProducts[0].name
    );

    return [lastProducts[0]];
  }

  // ==========================================
  // 7. FALLBACK TO RAG
  // ==========================================
  //
  // Important:
  //
  // Pass userId here.
  //
  // Otherwise RAG cannot access:
  //
  // favoriteLaptopBrand
  // favoriteMobileBrand
  // favoriteHeadphoneBrand
  //
  // dislikedLaptopBrands
  // dislikedMobileBrands
  // dislikedHeadphoneBrands
  //
  // ==========================================

  console.log(
    "No previous product matched."
  );

  console.log(
    "Falling back to preference-aware RAG."
  );

  return await retrieveRelevantProducts(
    message,
    userId
  );
};