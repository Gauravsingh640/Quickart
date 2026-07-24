import { generateResponse } from "./groq.service.js";

export const classifyIntent = async (message) => {
  const prompt = `
You are an intent classification system for an e-commerce shopping assistant.

Return ONLY ONE of these values:

GENERAL_CHAT
SEARCH_PRODUCT
COMPARE
BUY_NOW
PRODUCT_DETAILS
TRACK_ORDER
ORDER_HISTORY
CANCEL_ORDER

=========================================
GENERAL_CHAT
=========================================

Use GENERAL_CHAT when the user is only:
- sharing personal information
- sharing their name
- sharing preferences
- sharing likes/dislikes
- sharing favourite brands
- sharing budget as personal preference
- making normal conversation
- talking about liking/disliking a product

Examples:

"my name is Gaurav"
→ GENERAL_CHAT

"I like OnePlus"
→ GENERAL_CHAT

"I don't like Samsung"
→ GENERAL_CHAT

"I love iPhones"
→ GENERAL_CHAT

"I don't like this laptop"
→ GENERAL_CHAT

"my favourite brand is Apple"
→ GENERAL_CHAT

"my budget is 30000"
→ GENERAL_CHAT

"thanks"
→ GENERAL_CHAT

"hello"
→ GENERAL_CHAT

IMPORTANT:
GENERAL_CHAT must NOT return product recommendations/cards.

=========================================
SEARCH_PRODUCT
=========================================

Use when user wants products to be discovered,
recommended, suggested, searched, or shown.

Examples:

"suggest me a phone"
→ SEARCH_PRODUCT

"best gaming laptop"
→ SEARCH_PRODUCT

"phones under 30000"
→ SEARCH_PRODUCT

"show OnePlus phones"
→ SEARCH_PRODUCT

"recommend headphones"
→ SEARCH_PRODUCT

"do we have any iPhones?"
→ SEARCH_PRODUCT

"any other iPhone?"
→ SEARCH_PRODUCT

=========================================
PRODUCT_DETAILS
=========================================

Use when user wants information about a
specific product or a product shown previously.

Examples:

"tell me about OnePlus 13"
→ PRODUCT_DETAILS

"tell me about this product"
→ PRODUCT_DETAILS

"tell me about the first one"
→ PRODUCT_DETAILS

"what about the second one"
→ PRODUCT_DETAILS

"show details of Dell G15"
→ PRODUCT_DETAILS

"HP laptop ke bare me batao"
→ PRODUCT_DETAILS

IMPORTANT DIFFERENCE:

"I like OnePlus 13"
→ GENERAL_CHAT

"Tell me about OnePlus 13"
→ PRODUCT_DETAILS

"I don't like Dell G15"
→ GENERAL_CHAT

"Show me Dell G15"
→ PRODUCT_DETAILS

=========================================
COMPARE
=========================================

User explicitly wants comparison.

Examples:

"compare iPhone and Samsung"
→ COMPARE

"compare first and second"
→ COMPARE

"which is better Dell or HP?"
→ COMPARE

=========================================
BUY_NOW
=========================================

User explicitly wants to purchase/buy.

Examples:

"I want to buy this"
→ BUY_NOW

"buy OnePlus 13"
→ BUY_NOW

=========================================
ORDER INTENTS
=========================================

TRACK_ORDER:
"track my order"

ORDER_HISTORY:
"show my previous orders"

CANCEL_ORDER:
"cancel my order"

=========================================

User Message:
"${message}"

Return ONLY the intent.
`;

  const intent = await generateResponse(prompt);

  const cleaned = intent
    .toUpperCase()
    .replace(/[^A-Z_]/g, "")
    .trim();

  return cleaned;
};