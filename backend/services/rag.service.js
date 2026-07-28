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
// BRANDS
// ==========================================

const detectBrands = (query) => {
  const text = query.toLowerCase();

  const brands = [];

  const brandPatterns = [
    {
      brand: "Apple",
      regex:
        /\b(apple|iphone|iphones|macbook|macbooks|airpod|airpods)\b/i,
    },
    {
      brand: "OnePlus",
      regex: /\b(oneplus|one plus)\b/i,
    },
    {
      brand: "Samsung",
      regex: /\b(samsung|galaxy)\b/i,
    },
    {
      brand: "Dell",
      regex: /\bdell\b/i,
    },
    {
      brand: "HP",
      regex: /\bhp\b/i,
    },
    {
      brand: "Asus",
      regex: /\basus\b/i,
    },
    {
      brand: "Lenovo",
      regex: /\blenovo\b/i,
    },
    {
      brand: "Acer",
      regex: /\bacer\b/i,
    },
    {
      brand: "Boat",
      regex: /\bboat\b/i,
    },
    {
      brand: "Sony",
      regex: /\bsony\b/i,
    },
  ];

  for (const item of brandPatterns) {
    if (item.regex.test(text)) {
      brands.push(item.brand);
    }
  }

  return brands;
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
// USER ASKING FOR PREFERENCE?
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

    // ==========================================
    // DETECT CURRENT QUERY
    // ==========================================

    const category =
      detectCategory(query);

    const explicitBrands =
      detectBrands(query);

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

    console.log(
      "================================"
    );

    console.log(
      "RAG Query:",
      query
    );

    console.log(
      "Category:",
      category
    );

    console.log(
      "Explicit Brands:",
      explicitBrands
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

    console.log(
      "Budget:",
      budget
    );

    console.log(
      "================================"
    );

    // ==========================================
    // DETERMINE BRAND FILTER
    // ==========================================

    let requiredBrands = [];

    // Explicit brands always have highest priority.
    //
    // "show Samsung phones"
    // -> ["Samsung"]
    //
    // "compare Samsung and iPhone"
    // -> ["Samsung", "Apple"]

    if (explicitBrands.length > 0) {
      requiredBrands =
        explicitBrands;
    }

    // No explicit brand but user asks according
    // to saved preference.

    else if (
      preferenceQuery &&
      favoriteBrand
    ) {
      requiredBrands = [
        favoriteBrand,
      ];
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
    // REQUIRED BRANDS
    // ==========================================

    if (requiredBrands.length > 0) {

      const requiredBrandSet =
        new Set(
          requiredBrands.map(
            (brand) =>
              brand
                .trim()
                .toLowerCase()
          )
        );

      products =
        products.filter(
          (product) => {

            const productBrand =
              product.brand
                ?.trim()
                .toLowerCase();

            return (
              productBrand &&
              requiredBrandSet.has(
                productBrand
              )
            );
          }
        );
    }

    // ==========================================
    // DISLIKED BRANDS
    // ==========================================
    //
    // IMPORTANT:
    //
    // Explicit brand request overrides dislike.
    //
    // Example:
    // User dislikes Samsung
    //
    // "show phones"
    // -> Samsung removed
    //
    // "show Samsung phones"
    // -> Samsung allowed
    //
    // "compare Samsung and iPhone"
    // -> Samsung allowed
    // ==========================================

    if (
      explicitBrands.length === 0 &&
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

    if (
      !category &&
      requiredBrands.length === 0
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
    // MULTI-BRAND BALANCING
    // ==========================================
    //
    // This is important for:
    //
    // "compare Samsung and iPhone"
    //
    // Without balancing, top 5 vector results
    // could theoretically contain mostly one
    // brand.
    //
    // We make sure each explicitly requested
    // brand gets represented.
    // ==========================================

    if (explicitBrands.length >= 2) {

      const balancedProducts = [];

      const addedIds =
        new Set();

      // First take products from every brand.

      for (const brand of explicitBrands) {

        const brandProducts =
          products.filter(
            (product) =>
              product.brand
                ?.trim()
                .toLowerCase() ===
              brand
                .trim()
                .toLowerCase()
          );

        // Up to 2 products per explicitly
        // requested brand.

        for (
          const product of
          brandProducts.slice(0, 2)
        ) {

          const id =
            product._id.toString();

          if (!addedIds.has(id)) {

            balancedProducts.push(
              product
            );

            addedIds.add(id);
          }
        }
      }

      // Fill remaining slots from normal
      // similarity ranking.

      for (const product of products) {

        if (
          balancedProducts.length >= 5
        ) {
          break;
        }

        const id =
          product._id.toString();

        if (!addedIds.has(id)) {

          balancedProducts.push(
            product
          );

          addedIds.add(id);
        }
      }

      products =
        balancedProducts;
    }

    // ==========================================
    // LIMIT
    // ==========================================

    products =
      products.slice(0, 5);

    // ==========================================
    // DEBUG
    // ==========================================

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