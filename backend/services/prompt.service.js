export const buildShoppingPrompt = (
  message,
  products = [],
  order = null,
  intent = "SEARCH_PRODUCT",
  history = []
) => {
  const productContext =
    products.length > 0
      ? products
          .map(
            (product, index) => `
========================
Product ${index + 1}
========================
Name: ${product.name}
Brand: ${product.brand || "N/A"}
Category: ${product.category || "N/A"}
Price: ₹${product.price}
Stock: ${
              product.stock > 0
                ? `${product.stock} Available`
                : "Out of Stock"
            }
Description: ${product.description || "No description available"}
Image: ${product.images?.[0]?.url || "No Image"}
`
          )
          .join("\n")
      : "No products found.";

  const orderContext = order
    ? `
========================
ORDER DETAILS
========================
Order ID: ${order.orderId}
Status: ${order.status}
Total Price: ₹${order.totalPrice}
Delivery Code: ${order.deliveryCode || "N/A"}
`
    : "No order information available.";

  const historyContext =
    history.length > 0
      ? history
          .map((chat) => `${chat.role}: ${chat.message}`)
          .join("\n")
      : "No previous conversation.";

  let instructions = "";

  switch (intent) {
    case "SEARCH_PRODUCT":
      instructions =
        "Recommend the best matching products and explain why they match the user's requirements.";
      break;

    case "COMPARE":
      instructions =
        "Compare all relevant products. Mention their pros, cons, price differences, and recommend the best choice.";
      break;

    case "BUY_NOW":
      instructions =
        "Recommend the best product to purchase immediately based on the user's request.";
      break;

    case "PRODUCT_DETAILS":
      instructions =
        "Explain the product specifications, features, benefits, and suitable use cases.";
      break;

    case "TRACK_ORDER":
      instructions =
        "Explain the order status clearly and tell the user what the next delivery step is.";
      break;

    case "ORDER_HISTORY":
      instructions =
        "Summarize the user's previous orders in a concise manner.";
      break;

    case "CANCEL_ORDER":
      instructions =
        "Inform the user whether the order has been cancelled successfully or why it cannot be cancelled.";
      break;

    default:
      instructions =
        "Answer naturally using only the information provided.";
  }

  return `
You are Quickart AI Shopping Assistant.

Your job is to help customers with shopping, products, and orders.

Use ONLY the information provided below.

If the previous conversation is relevant, use it to understand follow-up questions like:
- "Show only Samsung"
- "Compare first two"
- "Which one is cheaper?"
- "Add the first one"

Never invent products, brands, prices, specifications, stock, or order details.

${instructions}

========================
PREVIOUS CONVERSATION
========================

${historyContext}

========================
PRODUCT INFORMATION
========================

${productContext}

${orderContext}

========================
CURRENT USER QUESTION
========================

${message}

========================
RULES
========================

1. Recommend ONLY products listed above.
2. Never invent any product, brand, order, or specification.
3. Mention product price and stock availability.
4. If multiple products exist, compare them clearly.
5. If no suitable product exists, politely inform the user.
6. Never mention similarity score, embeddings, vector search, or internal implementation details.
7. Understand follow-up questions using the previous conversation.
8. Keep responses concise, friendly, and professional.
`;
};