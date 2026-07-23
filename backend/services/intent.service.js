export function detectIntent(message) {
  const msg = message.toLowerCase().trim();

  // Add to Cart
  if (
    msg.includes("add to cart") ||
    msg.includes("add")
  ) {
    return "ADD_TO_CART";
  }

  // Buy Now
  if (
    msg.includes("buy") ||
    msg.includes("purchase") ||
    msg.includes("checkout")
  ) {
    return "BUY_NOW";
  }

  // Compare Products
  if (
    msg.includes("compare") ||
    msg.includes("difference")
  ) {
    return "COMPARE";
  }

  // Product Details
  if (
    msg.includes("details") ||
    msg.includes("detail") ||
    msg.includes("features") ||
    msg.includes("specifications") ||
    msg.includes("specs")
  ) {
    return "PRODUCT_DETAILS";
  }

  // Remove from Cart
  if (
    msg.includes("remove") ||
    msg.includes("delete")
  ) {
    return "REMOVE_FROM_CART";
  }

  return "SEARCH_PRODUCT";
}