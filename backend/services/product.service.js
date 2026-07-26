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
/**
 * ==========================================
 * COMPARE PRODUCTS
 * ==========================================
 *
 * Handles:
 * - "compare them"
 * - "compare both"
 * - "compare these"
 * - "compare first and second"
 * - "compare Sony and Samsung"
 * - "compare iPhone and OnePlus"
 */
export const compareProducts = async (
  message,
  userId = null
) => {
  // ==========================================
  // NO USER / SESSION
  // ==========================================

  if (!userId) {
    return await retrieveRelevantProducts(
      message,
      null
    );
  }

  // ==========================================
  // LOAD PREVIOUS PRODUCTS
  // ==========================================

  const lastProducts =
    await getLastProducts(userId);

  const searchProducts =
    await getSearchProducts(userId);

  const text = message
    .toLowerCase()
    .trim();

  console.log(
    "COMPARE - Message:",
    text
  );

  console.log(
    "COMPARE - Last Products:",
    lastProducts.map((p) => p.name)
  );

  console.log(
    "COMPARE - Search Products:",
    searchProducts.map((p) => p.name)
  );

  // ==========================================
  // 1. WINNER / BEST FOLLOW-UP
  // ==========================================
  //
  // IMPORTANT:
  //
  // Previous response:
  // Samsung + Sony
  //
  // User:
  // "which one is best?"
  //
  // We MUST return Samsung + Sony here.
  //
  // DO NOT call RAG.
  //
  // LLM will decide winner using these
  // exact products.
  // ==========================================

  const bestFollowUp =
    /\b(which\s+(one\s+)?(is\s+)?(best|better)|which\s+(is\s+)?(best|better)|best\s+(one\s+)?(among|between|from)|better\s+(one\s+)?(among|between|from)|which\s+(one\s+)?should\s+i\s+(buy|choose|pick)|which\s+(one\s+)?would\s+you\s+(choose|pick|recommend)|what\s+(would|do)\s+you\s+recommend|recommend\s+(one|the\s+best)|pick\s+(one|the\s+best))\b/i.test(
      text
    );

  if (
    bestFollowUp &&
    lastProducts.length >= 2
  ) {
    console.log(
      "🏆 Winner Follow-up detected"
    );

    console.log(
      "Using previous comparison products:",
      lastProducts.map((p) => p.name)
    );

    return lastProducts;
  }

  // ==========================================
  // 2. GENERIC COMPARISON FOLLOW-UP
  // ==========================================
  //
  // compare them
  // compare both
  // compare these
  // compare these two
  // difference between them
  // ==========================================

  const genericCompare =
    /\b(compare\s+(them|these|those|both|these\s+two|those\s+two)|compare\s+both|difference\s+between\s+(them|these|those)|difference\s+between\s+these\s+two)\b/i.test(
      text
    );

  if (
    genericCompare &&
    lastProducts.length >= 2
  ) {
    console.log(
      "Generic Compare → Previous Products:",
      lastProducts.map((p) => p.name)
    );

    return lastProducts;
  }

  // ==========================================
  // 3. POSITION BASED COMPARISON
  // ==========================================
  //
  // compare first and second
  // compare 1st and 3rd
  // ==========================================

  const positions = [
    {
      words: ["first", "1st"],
      index: 0,
    },
    {
      words: ["second", "2nd"],
      index: 1,
    },
    {
      words: ["third", "3rd"],
      index: 2,
    },
    {
      words: ["fourth", "4th"],
      index: 3,
    },
    {
      words: ["fifth", "5th"],
      index: 4,
    },
  ];

  const selectedProducts = [];

  for (const position of positions) {
    const mentioned =
      position.words.some((word) =>
        text.includes(word)
      );

    if (
      mentioned &&
      lastProducts[position.index]
    ) {
      selectedProducts.push(
        lastProducts[position.index]
      );
    }
  }

  if (selectedProducts.length >= 2) {
    console.log(
      "Position Compare:",
      selectedProducts.map(
        (p) => p.name
      )
    );

    return selectedProducts;
  }

  // ==========================================
  // 4. CREATE PRODUCT POOL
  // ==========================================

  const productMap = new Map();

  for (const product of [
    ...lastProducts,
    ...searchProducts,
  ]) {
    if (!product?._id) {
      continue;
    }

    productMap.set(
      product._id.toString(),
      product
    );
  }

  const availableProducts = [
    ...productMap.values(),
  ];

  console.log(
    "COMPARE - Available Products:",
    availableProducts.map(
      (p) => p.name
    )
  );

  // ==========================================
  // 5. EXACT PRODUCT NAME MATCH
  // ==========================================

  const exactMatches =
    availableProducts.filter((product) => {
      const productName =
        product.name
          ?.toLowerCase()
          .trim();

      if (!productName) {
        return false;
      }

      return text.includes(productName);
    });

  if (exactMatches.length >= 2) {
    console.log(
      "Exact Compare:",
      exactMatches.map(
        (p) => p.name
      )
    );

    return exactMatches;
  }

  // ==========================================
  // 6. QUERY WORDS
  // ==========================================

  const ignoredWords = new Set([
    "compare",
    "comparison",

    "vs",
    "versus",

    "and",
    "with",
    "between",

    "the",
    "a",
    "an",

    "me",
    "please",

    "product",
    "products",

    "one",
    "ones",

    "show",
    "tell",
    "about",

    "this",
    "that",
    "these",
    "those",

    "which",
    "best",
    "better",

    "according",
    "you",

    "should",
    "choose",
    "pick",
    "recommend",
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
    "COMPARE Query Words:",
    queryWords
  );

  // ==========================================
  // 7. SCORE AVAILABLE PRODUCTS
  // ==========================================

  const scoredProducts =
    availableProducts
      .map((product) => {
        const productText = `
          ${product.name || ""}
          ${product.brand || ""}
          ${product.category || ""}
        `
          .toLowerCase()
          .replace(/[^\w\s]/g, " ");

        const productWords =
          productText
            .split(/\s+/)
            .filter(Boolean);

        let score = 0;

        for (const word of queryWords) {
          // Exact word match
          if (
            productWords.includes(word)
          ) {
            score += 2;
            continue;
          }

          // Partial word match
          if (
            productWords.some(
              (productWord) =>
                productWord.includes(word) ||
                word.includes(productWord)
            )
          ) {
            score += 1;
          }
        }

        return {
          product,
          score,
        };
      })
      .filter(
        (item) => item.score > 0
      )
      .sort(
        (a, b) =>
          b.score - a.score
      );

  console.log(
    "COMPARE Scored Products:",
    scoredProducts.map((item) => ({
      name: item.product.name,
      score: item.score,
    }))
  );

  // ==========================================
  // 8. DETECT MENTIONED BRANDS
  // ==========================================
  //
  // Example:
  //
  // compare Sony Wireless Ear Headphone
  // and Samsung Galaxy Buds4 Pro
  //
  // Sony + Samsung must both be returned.
  // ==========================================

  const mentionedBrands = [];

  for (const product of availableProducts) {
    const brand =
      product.brand
        ?.toLowerCase()
        .trim();

    if (
      brand &&
      text.includes(brand) &&
      !mentionedBrands.includes(brand)
    ) {
      mentionedBrands.push(brand);
    }
  }

  console.log(
    "COMPARE Mentioned Brands:",
    mentionedBrands
  );

  if (mentionedBrands.length >= 2) {
    const brandSelected = [];

    for (const brand of mentionedBrands) {
      const candidates =
        scoredProducts.filter(
          ({ product }) =>
            product.brand
              ?.toLowerCase()
              .trim() === brand
        );

      if (candidates.length > 0) {
        brandSelected.push(
          candidates[0].product
        );
      }
    }

    if (brandSelected.length >= 2) {
      console.log(
        "Brand Specific Compare:",
        brandSelected.map(
          (p) => p.name
        )
      );

      return brandSelected;
    }
  }

  // ==========================================
  // 9. SMART TOP TWO
  // ==========================================

  if (scoredProducts.length >= 2) {
    const topTwo =
      scoredProducts
        .slice(0, 2)
        .map(
          (item) =>
            item.product
        );

    console.log(
      "Smart Top Two Compare:",
      topTwo.map((p) => p.name)
    );

    return topTwo;
  }

  // ==========================================
  // 10. SPECIAL SAFETY FALLBACK
  // ==========================================
  //
  // We already have two previous products.
  //
  // Since intent is COMPARE, it is safer
  // to compare those instead of returning
  // unrelated RAG products.
  // ==========================================

  if (lastProducts.length >= 2) {
    console.log(
      "⚠️ Compare fallback → using previous products:",
      lastProducts.map((p) => p.name)
    );

    return lastProducts;
  }

  // ==========================================
  // 11. FINAL RAG FALLBACK
  // ==========================================

  console.log(
    "COMPARE: No usable previous comparison."
  );

  console.log(
    "COMPARE: Falling back to RAG."
  );

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