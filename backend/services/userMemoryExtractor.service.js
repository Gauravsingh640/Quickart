import { remember, recall } from "./userMemory.service.js";

const normalizeBrand = (brand) => {
  if (!brand) return null;

  const value = brand.trim().toLowerCase();

  const brands = {
    hp: "HP",
    dell: "Dell",
    apple: "Apple",
    iphone: "Apple",
    macbook: "Apple",
    samsung: "Samsung",
    galaxy: "Samsung",
    oneplus: "OnePlus",
    "one plus": "OnePlus",
    asus: "Asus",
    lenovo: "Lenovo",
    acer: "Acer",
    boat: "Boat",
    sony: "Sony",
  };

  return brands[value] || brand.trim();
};

const detectCategory = (text) => {
  const value = text.toLowerCase();

  if (/\b(laptop|laptops|notebook|notebooks|macbook|macbooks)\b/i.test(value)) {
    return "Laptop";
  }

  if (
    /\b(phone|phones|mobile|mobiles|smartphone|smartphones|iphone|iphones)\b/i.test(
      value
    )
  ) {
    return "Mobile";
  }

  if (
    /\b(headphone|headphones|headset|headsets|earphone|earphones|earbud|earbuds|airpod|airpods|buds)\b/i.test(
      value
    )
  ) {
    return "Headphone";
  }

  return null;
};

const detectBrand = (text) => {
  const value = text.toLowerCase();

  if (/\b(oneplus|one plus)\b/i.test(value)) return "OnePlus";
  if (/\b(samsung|galaxy)\b/i.test(value)) return "Samsung";
  if (/\b(apple|iphone|iphones|macbook|macbooks)\b/i.test(value)) return "Apple";
  if (/\bdell\b/i.test(value)) return "Dell";
  if (/\bhp\b/i.test(value)) return "HP";
  if (/\basus\b/i.test(value)) return "Asus";
  if (/\blenovo\b/i.test(value)) return "Lenovo";
  if (/\bacer\b/i.test(value)) return "Acer";
  if (/\bboat\b/i.test(value)) return "Boat";
  if (/\bsony\b/i.test(value)) return "Sony";

  return null;
};

const addToArrayMemory = async (userId, key, value) => {
  const existing = await recall(userId, key);

  let values = Array.isArray(existing) ? existing : [];

  if (
    !values.some(
      (item) =>
        item.toLowerCase() === value.toLowerCase()
    )
  ) {
    values.push(value);
  }

  await remember(userId, key, values);
};

const removeFromArrayMemory = async (userId, key, value) => {
  const existing = await recall(userId, key);

  if (!Array.isArray(existing)) return;

  const values = existing.filter(
    (item) =>
      item.toLowerCase() !== value.toLowerCase()
  );

  await remember(userId, key, values);
};

export async function extractMemory(userId, message) {
  if (!userId || !message?.trim()) return;

  console.log("Extracting Memory:", message);

  const text = message.trim();

  let match;

  // ==========================================
  // NAME
  // ==========================================

  match = text.match(/^my name is\s+(.+)$/i);

  if (match) {
    const name = match[1].trim();

    console.log("Saving Name:", name);

    await remember(userId, "name", name);
  }

  // ==========================================
  // BUDGET
  // ==========================================

  match = text.match(
    /my budget is\s*₹?\s*([\d,]+)/i
  );

  if (match) {
    const budget = Number(
      match[1].replace(/,/g, "")
    );

    console.log("Saving Budget:", budget);

    await remember(userId, "budget", budget);
  }

  // ==========================================
  // GENERAL FAVOURITE BRAND
  // ==========================================

  match = text.match(
    /my favou?rite brand is\s+(.+)/i
  );

  if (match) {
    const brand =
      normalizeBrand(match[1]);

    console.log(
      "Saving Favourite Brand:",
      brand
    );

    await remember(
      userId,
      "favoriteBrand",
      brand
    );
  }

  // ==========================================
  // CATEGORY-SPECIFIC LIKE / FAVOURITE
  //
  // Examples:
  // my favorite laptop is HP
  // my favourite phone is OnePlus
  // my favorite headphone is Sony
  // I like HP laptops
  // ==========================================

  const category = detectCategory(text);
  const brand = detectBrand(text);

  const isLikeStatement =
    /\b(i like|i love|my favou?rite|my favorite|i prefer)\b/i.test(
      text
    );

  const isDislikeStatement =
    /\b(i don't like|i dont like|i dislike|i hate|not a fan of)\b/i.test(
      text
    );

  if (
    category &&
    brand &&
    isLikeStatement &&
    !isDislikeStatement
  ) {
    const key =
      category === "Laptop"
        ? "favoriteLaptopBrand"
        : category === "Mobile"
        ? "favoriteMobileBrand"
        : "favoriteHeadphoneBrand";

    console.log(
      `Saving ${key}:`,
      brand
    );

    await remember(userId, key, brand);

    // If user previously disliked this brand,
    // liking it again removes that dislike.
    const dislikeKey =
      category === "Laptop"
        ? "dislikedLaptopBrands"
        : category === "Mobile"
        ? "dislikedMobileBrands"
        : "dislikedHeadphoneBrands";

    await removeFromArrayMemory(
      userId,
      dislikeKey,
      brand
    );
  }

  // ==========================================
  // CATEGORY-SPECIFIC DISLIKE
  //
  // I don't like Dell laptops
  // I hate Samsung phones
  // I dislike Boat headphones
  // ==========================================

  if (
    category &&
    brand &&
    isDislikeStatement
  ) {
    const key =
      category === "Laptop"
        ? "dislikedLaptopBrands"
        : category === "Mobile"
        ? "dislikedMobileBrands"
        : "dislikedHeadphoneBrands";

    console.log(
      `Adding disliked brand to ${key}:`,
      brand
    );

    await addToArrayMemory(
      userId,
      key,
      brand
    );

    // If this was previously the favourite,
    // remove the favourite.
    const favoriteKey =
      category === "Laptop"
        ? "favoriteLaptopBrand"
        : category === "Mobile"
        ? "favoriteMobileBrand"
        : "favoriteHeadphoneBrand";

    const currentFavorite =
      await recall(userId, favoriteKey);

    if (
      currentFavorite &&
      currentFavorite.toLowerCase() ===
        brand.toLowerCase()
    ) {
      await remember(
        userId,
        favoriteKey,
        null
      );
    }
  }

  // ==========================================
  // CITY
  // ==========================================

  match = text.match(/^i live in\s+(.+)$/i);

  if (match) {
    await remember(
      userId,
      "city",
      match[1].trim()
    );
  }

  // ==========================================
  // PROFESSION
  // ==========================================

  match = text.match(/^i am an?\s+(.+)$/i);

  if (match) {
    await remember(
      userId,
      "profession",
      match[1].trim()
    );
  }
}