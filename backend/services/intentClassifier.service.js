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
- sharing budget as a personal preference
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

Use SEARCH_PRODUCT when the user wants to:
- discover products
- search products
- see products
- get recommendations without referring to previously compared products
- find the best product from the catalog/category generally

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

"show best laptop under 60000"
→ SEARCH_PRODUCT

"recommend me a Samsung phone"
→ SEARCH_PRODUCT

IMPORTANT:

A general request for the best product in a category
is SEARCH_PRODUCT.

Example:

"best laptop under 50000"
→ SEARCH_PRODUCT

But asking which is best/better BETWEEN previously
shown or compared products is COMPARE.

=========================================
PRODUCT_DETAILS
=========================================

Use PRODUCT_DETAILS when the user wants information
about a specific product or a product shown previously.

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

Use COMPARE whenever the user is comparing two or more
products OR asking for a winner/recommendation among
products that were already being compared or shown.

This includes:

- direct comparison
- differences
- versus / vs
- compare previous products
- asking which of two/multiple products is better
- asking which one should be selected
- asking which one you recommend
- asking for the best among previous products

Examples:

"compare Samsung and Sony"
→ COMPARE

"compare them"
→ COMPARE

"compare both"
→ COMPARE

"compare these two"
→ COMPARE

"difference between these two"
→ COMPARE

"Samsung vs Sony"
→ COMPARE

"compare first and second"
→ COMPARE

"which one is best between these two?"
→ COMPARE

"which one is better?"
→ COMPARE

"which one is best according to you?"
→ COMPARE

"which one is best between two according to you?"
→ COMPARE

"which should I choose?"
→ COMPARE

"which one should I buy?"
→ COMPARE

"which one would you recommend?"
→ COMPARE

"pick one between these two"
→ COMPARE

"recommend one from these"
→ COMPARE

"which is better among them?"
→ COMPARE

"which one has better specifications?"
→ COMPARE

"which one is cheaper between them?"
→ COMPARE

IMPORTANT:

If the user refers to TWO OR MORE existing/shown/compared
products and asks which is best/better/recommended,
the intent MUST remain COMPARE.

Do NOT change it to SEARCH_PRODUCT.

Example conversation:

User:
"compare Sony Wireless Ear Headphone and Samsung Galaxy Buds4 Pro"
→ COMPARE

Then user:
"which one is best according to you?"
→ COMPARE

Then user:
"which one should I choose?"
→ COMPARE

This allows the comparison system to continue using
the same previously compared products.

A normal comparison does NOT automatically mean the
assistant should declare a winner.

Example:

"compare Sony and Samsung"
→ COMPARE

The response should compare both neutrally.

Only when the user explicitly asks:
"which is best?"
"which is better?"
"which should I choose?"
"which do you recommend?"

then the assistant may select/recommend a winner.

=========================================
BUY_NOW
=========================================

Use BUY_NOW only when the user explicitly wants to
perform a purchase action.

Examples:

"I want to buy this"
→ BUY_NOW

"buy OnePlus 13"
→ BUY_NOW

"purchase this phone"
→ BUY_NOW

IMPORTANT:

"which one should I buy?"
→ COMPARE

because the user is asking for advice between products.

But:

"I want to buy Samsung Galaxy Buds4 Pro"
→ BUY_NOW

because the user has made the purchase decision.

=========================================
ORDER INTENTS
=========================================

TRACK_ORDER:

"track my order"
→ TRACK_ORDER

"where is my order?"
→ TRACK_ORDER


ORDER_HISTORY:

"show my previous orders"
→ ORDER_HISTORY

"show my orders"
→ ORDER_HISTORY


CANCEL_ORDER:

"cancel my order"
→ CANCEL_ORDER

"I want to cancel my order"
→ CANCEL_ORDER

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