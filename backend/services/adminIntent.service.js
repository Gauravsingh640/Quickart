// services/adminIntent.service.js

import { generateResponse } from "./groq.service.js";


// ==========================================
// VALID ADMIN INTENTS
// ==========================================

const VALID_INTENTS = [
  "GENERAL_CHAT",
  "MEMORY_RECALL",
  "BUSINESS_OVERVIEW",
  "SALES_ANALYSIS",
  "TODAY_SALES",
  "WEEKLY_SALES",
  "TOP_PRODUCTS",
  "LEAST_SELLING_PRODUCTS",
  "LOW_STOCK",
  "PRODUCT_STOCK",
  "CATEGORY_ANALYSIS",
  "ORDER_ANALYSIS",
  "INVENTORY",
];


// ==========================================
// ADMIN INTENT CLASSIFIER
// ==========================================

export const classifyAdminIntent = async (message) => {
  try {
    // ========================================
    // 1. BASIC INPUT VALIDATION
    // ========================================

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return "GENERAL_CHAT";
    }

    const cleanMessage = message.trim();


    // ========================================
    // 2. BUILD CLASSIFICATION PROMPT
    // ========================================

    const prompt = `
You are an intent classification system
for Quickart's e-commerce Admin AI Assistant.

Your ONLY task is to classify the admin's
message into exactly ONE intent.

Return ONLY ONE of these values:

GENERAL_CHAT
BUSINESS_OVERVIEW
SALES_ANALYSIS
TODAY_SALES
WEEKLY_SALES
TOP_PRODUCTS
LEAST_SELLING_PRODUCTS
PRODUCT_STOCK
LOW_STOCK
CATEGORY_ANALYSIS
ORDER_ANALYSIS
INVENTORY

Do not explain your answer.
Do not return JSON.
Do not return markdown.
Do not add punctuation.
Do not return multiple intents.


=========================================
GENERAL_CHAT
=========================================

Use GENERAL_CHAT when the message is:

- normal conversation
- greeting
- acknowledgement
- admin preference
- formatting preference
- personal information
- something that does not require
  Quickart business analytics

Examples:

"hello"
→ GENERAL_CHAT

"hi"
→ GENERAL_CHAT

"thanks"
→ GENERAL_CHAT

"my name is Gaurav"
→ GENERAL_CHAT

"show reports in lakhs"
→ GENERAL_CHAT

"use rupees"
→ GENERAL_CHAT

"always show sales first"
→ GENERAL_CHAT

"keep responses short"
→ GENERAL_CHAT

=========================================
MEMORY_RECALL
=========================================

Use MEMORY_RECALL when the admin asks about
previously saved preferences or personal information.

Examples:

"What do you remember about me?"
→ MEMORY_RECALL

"What reporting preference do you remember?"
→ MEMORY_RECALL

"Do you remember my name?"
→ MEMORY_RECALL

"What currency do I use?"
→ MEMORY_RECALL

"What report format do I prefer?"
→ MEMORY_RECALL

"What dashboard preference did I save?"
→ MEMORY_RECALL

=========================================
BUSINESS_OVERVIEW
=========================================

Use BUSINESS_OVERVIEW for current overall
business totals, dashboard-level metrics,
or a general business summary.

Typical metrics include:

- total revenue
- total orders
- total users
- total products
- overall business summary

Examples:

"give me business overview"
→ BUSINESS_OVERVIEW

"how is my business doing?"
→ BUSINESS_OVERVIEW

"show dashboard summary"
→ BUSINESS_OVERVIEW

"show overall business stats"
→ BUSINESS_OVERVIEW

"how much total revenue do we have?"
→ BUSINESS_OVERVIEW

"what is our total revenue?"
→ BUSINESS_OVERVIEW

"how many users do we have?"
→ BUSINESS_OVERVIEW

"how many products are there?"
→ BUSINESS_OVERVIEW

"how many total orders?"
→ BUSINESS_OVERVIEW


IMPORTANT:

A question about TOTAL or CURRENT overall
revenue should normally be BUSINESS_OVERVIEW.

Example:

"what is our total revenue?"
→ BUSINESS_OVERVIEW

But revenue across months, periods, or trends
belongs to SALES_ANALYSIS.


=========================================
SALES_ANALYSIS
=========================================

Use SALES_ANALYSIS when the admin asks about:

- sales over time
- revenue over time
- monthly sales
- monthly revenue
- sales trends
- period comparisons
- highest/lowest sales period
- historical sales performance

Examples:

"show monthly sales"
→ SALES_ANALYSIS

"show sales report"
→ SALES_ANALYSIS

"how are sales performing?"
→ SALES_ANALYSIS

"which month had highest sales?"
→ SALES_ANALYSIS

"which month generated most revenue?"
→ SALES_ANALYSIS

"compare monthly revenue"
→ SALES_ANALYSIS

"show revenue trend"
→ SALES_ANALYSIS

"compare May and June sales"
→ SALES_ANALYSIS

"what were last month's sales?"
→ SALES_ANALYSIS


IMPORTANT:

Current overall revenue:

"what is total revenue?"
→ BUSINESS_OVERVIEW


Revenue over time:

"show monthly revenue"
→ SALES_ANALYSIS

=========================================
TODAY_SALES
=========================================

Use TODAY_SALES when the admin asks about:

- today's sales
- today sales
- today's revenue
- revenue today
- today's orders
- sales today
- today's business
- how much sold today
- how much revenue today

Examples:

"today business"
→ TODAY_SALES

"today earning"
→ TODAY_SALES

"today turnover"
→ TODAY_SALES

"today report"
→ TODAY_SALES

"today sales"
→ TODAY_SALES

"tell me today sales"
→ TODAY_SALES

"today revenue"
→ TODAY_SALES

"how much sold today?"
→ TODAY_SALES

"today order report"
→ TODAY_SALES

=========================================
WEEKLY_SALES
=========================================

Use WEEKLY_SALES when the admin asks about:

- weekly sales
- weekly revenue
- weekly report
- sales this week
- revenue this week
- last week sales
- current week sales

Examples:

"last 7 days sales"
→ WEEKLY_SALES

"past week revenue"
→ WEEKLY_SALES

"weekly business"
→ WEEKLY_SALES

"week report"
→ WEEKLY_SALES

"weekly sales"
→ WEEKLY_SALES

"show weekly sales"
→ WEEKLY_SALES

"this week sales"
→ WEEKLY_SALES

"weekly revenue"
→ WEEKLY_SALES

"tell me weekly report"
→ WEEKLY_SALES

=========================================
LEAST_SELLING_PRODUCTS
=========================================

Use LEAST_SELLING_PRODUCTS when the admin asks about:

- least selling products
- lowest selling products
- least purchased products
- products bought least
- products sold least
- worst selling products

Examples:

"worst selling product"
→ LEAST_SELLING_PRODUCTS

"least ordered product"
→ LEAST_SELLING_PRODUCTS

"bottom selling products"
→ LEAST_SELLING_PRODUCTS

"products with lowest sales"
→ LEAST_SELLING_PRODUCTS

"which product bought least?"
→ LEAST_SELLING_PRODUCTS

"least selling product"
→ LEAST_SELLING_PRODUCTS

"lowest selling product"
→ LEAST_SELLING_PRODUCTS

"show least selling products"
→ LEAST_SELLING_PRODUCTS

=========================================
PRODUCT_STOCK
=========================================

Use PRODUCT_STOCK when the admin asks about
the stock of a specific product.

Examples:

"iphone stock"
→ PRODUCT_STOCK

"stock of macbook"
→ PRODUCT_STOCK

"remaining stock of oneplus"
→ PRODUCT_STOCK

"available stock of iphone"
→ PRODUCT_STOCK

"stock of iphone 15"
→ PRODUCT_STOCK

"how many OnePlus 13 are left?"
→ PRODUCT_STOCK

"current stock of Boat Airdopes"
→ PRODUCT_STOCK

"available quantity of HP Laptop"
→ PRODUCT_STOCK

=========================================
TOP_PRODUCTS
=========================================

Use TOP_PRODUCTS when the admin asks about:

- best-selling products
- top-selling products
- highest-performing products
- product sales ranking
- products generating most revenue
- products selling the most units

Examples:

"show top selling products"
→ TOP_PRODUCTS

"what is our best selling product?"
→ TOP_PRODUCTS

"which products generate most revenue?"
→ TOP_PRODUCTS

"show top 5 products"
→ TOP_PRODUCTS

"which product sold the most?"
→ TOP_PRODUCTS

"show best performing products"
→ TOP_PRODUCTS

"what are my top products?"
→ TOP_PRODUCTS


=========================================
LOW_STOCK
=========================================

Use LOW_STOCK specifically when the admin
wants to IDENTIFY PRODUCTS that need
restocking.

Typical requests include:

- low-stock products
- out-of-stock products requiring attention
- products below a stock threshold
- products running out
- restocking recommendations

Examples:

"which products should I restock?"
→ LOW_STOCK

"show low stock products"
→ LOW_STOCK

"what needs restocking?"
→ LOW_STOCK

"products below 10 stock"
→ LOW_STOCK

"products below threshold"
→ LOW_STOCK

"products below configured threshold"
→ LOW_STOCK

"which products are running out?"
→ LOW_STOCK

"show products with low inventory"
→ LOW_STOCK

"what should I reorder?"
→ LOW_STOCK


=========================================
CATEGORY_ANALYSIS
=========================================

Use CATEGORY_ANALYSIS when the admin asks
about performance grouped by product category.

Typical requests include:

- category sales
- category revenue
- category ranking
- category comparison
- best-performing category

Examples:

"which category sells the most?"
→ CATEGORY_ANALYSIS

"show category performance"
→ CATEGORY_ANALYSIS

"which category generates most revenue?"
→ CATEGORY_ANALYSIS

"compare category sales"
→ CATEGORY_ANALYSIS

"what is our best category?"
→ CATEGORY_ANALYSIS

"show revenue by category"
→ CATEGORY_ANALYSIS


=========================================
ORDER_ANALYSIS
=========================================

Use ORDER_ANALYSIS when the admin asks about:

- order statuses
- order status distribution
- pending orders
- confirmed orders
- packed orders
- shipped orders
- out-for-delivery orders
- delivered orders
- cancelled orders

Examples:

"show order breakdown"
→ ORDER_ANALYSIS

"how many orders are delivered?"
→ ORDER_ANALYSIS

"how many orders are cancelled?"
→ ORDER_ANALYSIS

"show order status report"
→ ORDER_ANALYSIS

"cancelled vs delivered orders"
→ ORDER_ANALYSIS

"how many orders are pending?"
→ ORDER_ANALYSIS

"how many orders are shipped?"
→ ORDER_ANALYSIS

"show order distribution"
→ ORDER_ANALYSIS


IMPORTANT:

"how many total orders?"
→ BUSINESS_OVERVIEW

because this asks for one overall business total.

But:

"how many pending orders?"
→ ORDER_ANALYSIS

because this asks about an order status.


=========================================
INVENTORY
=========================================

Use INVENTORY for an OVERALL inventory
or stock analysis.

Typical requests include:

- inventory overview
- overall stock health
- inventory value
- count of low-stock items
- count of out-of-stock items
- overall inventory report

Examples:

"show inventory report"
→ INVENTORY

"how is inventory looking?"
→ INVENTORY

"what is our inventory value?"
→ INVENTORY

"how many products are out of stock?"
→ INVENTORY

"how many products have healthy stock?"
→ INVENTORY

"give me stock overview"
→ INVENTORY

"show overall inventory status"
→ INVENTORY

=========================================
PRODUCT_STOCK VS LOW_STOCK
=========================================

PRODUCT_STOCK

Specific product stock.

Example:

"stock of iphone 15"
→ PRODUCT_STOCK

"how many oneplus are left?"
→ PRODUCT_STOCK


LOW_STOCK

List all products requiring restocking.

Example:

"show low stock products"
→ LOW_STOCK

"which products need restocking?"
→ LOW_STOCK

=========================================
LOW_STOCK VS INVENTORY
=========================================

LOW_STOCK is used when the admin wants
the actual PRODUCTS that need restocking.

Example:

"which products should I restock?"
→ LOW_STOCK

"show products below 5 stock"
→ LOW_STOCK


INVENTORY is used when the admin wants
an overall inventory summary or counts.

Example:

"give me inventory overview"
→ INVENTORY

"how many products are out of stock?"
→ INVENTORY

"what is total inventory value?"
→ INVENTORY


=========================================
BUSINESS_OVERVIEW VS SALES_ANALYSIS
=========================================

BUSINESS_OVERVIEW:

Use for overall/current totals.

Examples:

"what is total revenue?"
→ BUSINESS_OVERVIEW

"how many total orders?"
→ BUSINESS_OVERVIEW


SALES_ANALYSIS:

Use for sales/revenue across time periods.

Examples:

"show monthly revenue"
→ SALES_ANALYSIS

"which month had highest sales?"
→ SALES_ANALYSIS


=========================================
BUSINESS_OVERVIEW VS ORDER_ANALYSIS
=========================================

BUSINESS_OVERVIEW:

"how many total orders?"
→ BUSINESS_OVERVIEW


ORDER_ANALYSIS:

"how many cancelled orders?"
→ ORDER_ANALYSIS

"how many delivered orders?"
→ ORDER_ANALYSIS


=========================================
TOP_PRODUCTS VS CATEGORY_ANALYSIS
=========================================

TOP_PRODUCTS is about individual products.

Example:

"which product sells the most?"
→ TOP_PRODUCTS


CATEGORY_ANALYSIS is about product categories.

Example:

"which category sells the most?"
→ CATEGORY_ANALYSIS


=========================================
CLASSIFICATION PRIORITY
=========================================

When a message could appear to match multiple
intents, classify based on the MOST SPECIFIC
analytics request.

Examples:

"What reporting preference do you remember?"
→ MEMORY_RECALL

"What do you remember about me?"
→ MEMORY_RECALL

"iphone stock"
→ PRODUCT_STOCK

"worst selling product"
→ LEAST_SELLING_PRODUCTS

"today business"
→ TODAY_SALES

"weekly business"
→ WEEKLY_SALES

"today sales"
→ TODAY_SALES

"weekly sales"
→ WEEKLY_SALES

"least selling product"
→ LEAST_SELLING_PRODUCTS

"stock of iphone 15"
→ PRODUCT_STOCK

"which products are out of stock?"
→ LOW_STOCK

because the admin wants specific products.


"how many products are out of stock?"
→ INVENTORY

because the admin wants an inventory count.


"how many total orders?"
→ BUSINESS_OVERVIEW


"how many pending orders?"
→ ORDER_ANALYSIS


"what is total revenue?"
→ BUSINESS_OVERVIEW


"which month generated most revenue?"
→ SALES_ANALYSIS


"which product generated most revenue?"
→ TOP_PRODUCTS


"which category generated most revenue?"
→ CATEGORY_ANALYSIS


=========================================
FINAL RULES
=========================================

1. Return exactly ONE intent.

2. Return only the intent name.

3. Never explain the classification.

4. Never return JSON.

5. Never use markdown.

6. Never return punctuation.

7. If the message does not clearly require
   business analytics, use GENERAL_CHAT.


=========================================
ADMIN MESSAGE
=========================================

${cleanMessage}


=========================================
OUTPUT
=========================================

Return ONLY the intent.
`;


    // ========================================
    // 3. ASK GROQ
    // ========================================

    const response = await generateResponse(prompt);


    // ========================================
    // 4. NORMALIZE RESPONSE
    // ========================================

    const cleaned = String(response || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z_]/g, "");


    console.log(
      "Admin Intent Classification:",
      {
        message: cleanMessage,
        raw: response,
        cleaned,
      }
    );
    


    // ========================================
    // 5. VALIDATE INTENT
    // ========================================

    if (VALID_INTENTS.includes(cleaned)) {
      return cleaned;
    }


    // ========================================
    // 6. SAFE FALLBACK
    // ========================================

    console.warn(
      "Invalid Admin Intent Response:",
      response
    );

    return "GENERAL_CHAT";

  } catch (error) {
    console.error(
      "Admin Intent Error:",
      error
    );

    return "GENERAL_CHAT";
  }
};