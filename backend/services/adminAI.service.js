// // services/adminAI.service.js

// import {
//   classifyAdminIntent,
// } from "./adminIntent.service.js";

// import {
//   executeAdminTool,
// } from "./adminToolExecutor.service.js";

// import {
//   getAI,
//   GROQ_MODEL,
// } from "./groq.service.js";

// import {
//   CHAT_PROMPT,
// } from "../prompts/chat.prompt.js";


// // ==========================================
// // GROQ CLIENT
// // ==========================================

// const groq = getAI();


// // ==========================================
// // GENERATE ADMIN AI RESPONSE
// // ==========================================

// export const generateAdminAIResponse = async (
//   question,
//   memories = {}
// ) => {
//   try {

//     // ========================================
//     // 1. VALIDATE QUESTION
//     // ========================================

//     if (
//       typeof question !== "string" ||
//       !question.trim()
//     ) {
//       throw new Error(
//         "Admin AI question is required."
//       );
//     }

//     const cleanQuestion =
//       question.trim();


//     // ========================================
//     // 2. CLASSIFY INTENT
//     // ========================================

//     const intent =
//       await classifyAdminIntent(
//         cleanQuestion
//       );


//     console.log(
//       "Admin AI Intent:",
//       intent
//     );


//     // ========================================
//     // 3. EXECUTE ANALYTICS TOOL
//     // ========================================

//     const toolResult =
//       await executeAdminTool(
//         intent
//       );


//     console.log(
//       "Admin AI Tool:",
//       toolResult.tool
//     );


//     console.log(
//       "Admin AI Tool Data:",
//       JSON.stringify(
//         toolResult.data,
//         null,
//         2
//       )
//     );


//     // ========================================
//     // 4. MEMORY CONTEXT
//     // ========================================

//     const hasMemories =
//       memories &&
//       typeof memories === "object" &&
//       !Array.isArray(memories) &&
//       Object.keys(memories).length > 0;


//     const memoryContext =
//       hasMemories
//         ? Object.entries(memories)
//             .map(
//               ([key, value]) => {

//                 let formattedValue;

//                 if (
//                   value !== null &&
//                   typeof value === "object"
//                 ) {
//                   formattedValue =
//                     JSON.stringify(value);
//                 } else {
//                   formattedValue =
//                     String(value);
//                 }

//                 return `${key}: ${formattedValue}`;
//               }
//             )
//             .join("\n")

//         : "No saved admin preferences.";


//     // ========================================
//     // 5. ANALYTICS CONTEXT
//     // ========================================

//     // IMPORTANT:
//     //
//     // [] is valid analytics data.
//     // {} is valid analytics data.
//     //
//     // Only null / undefined mean that no
//     // analytics data was supplied.

//     const hasAnalyticsData =
//       toolResult.data !== null &&
//       toolResult.data !== undefined;


//     const analyticsContext =
//       hasAnalyticsData
//         ? JSON.stringify(
//             toolResult.data,
//             null,
//             2
//           )
//         : "No analytics data required.";


//     // ========================================
//     // 6. BUILD FINAL PROMPT
//     // ========================================

//     const prompt = `
// ${CHAT_PROMPT}


// =========================================
// ADMIN INTENT
// =========================================

// ${intent}


// =========================================
// KNOWN ADMIN INFORMATION
// =========================================

// ${memoryContext}


// =========================================
// ANALYTICS TYPE
// =========================================

// ${toolResult.tool}


// =========================================
// ANALYTICS DATA
// =========================================

// ${analyticsContext}


// =========================================
// ADMIN QUESTION
// =========================================

// ${cleanQuestion}


// =========================================
// CORE DATA RULES
// =========================================

// 1. For business or analytics questions,
//    answer using ONLY the ANALYTICS DATA
//    supplied above.

// 2. Never invent, estimate, assume,
//    or hallucinate:

//    - revenue
//    - orders
//    - users
//    - products
//    - stock
//    - sales
//    - categories
//    - inventory values
//    - business statistics
//    - growth percentages

// 3. If information required to answer the
//    question is genuinely absent from
//    ANALYTICS DATA, clearly state that
//    there is not enough information.

// 4. null or undefined means analytics data
//    was not supplied.

// 5. Empty arrays and empty objects are
//    valid analytics results.

// 6. Never expose raw analytics JSON unless
//    the admin explicitly asks for raw data.


// =========================================
// ADMIN MEMORY
// =========================================

// 7. Use saved admin preferences when relevant.

// 8. Saved preferences may affect:

//    - currency
//    - report formatting
//    - response preferences
//    - dashboard preferences
//    - default reporting period

// 9. Saved preferences must NEVER be used
//    to invent business analytics.


// =========================================
// CURRENCY
// =========================================

// 10. Quickart's default currency is
//     Indian Rupees.

// 11. Display monetary values using:

//     ₹

// 12. Use Indian number formatting when
//     appropriate.

//     Examples:

//     ₹89,999
//     ₹1,25,000
//     ₹12,50,000

// 13. Do NOT use "$" unless the admin has
//     explicitly saved a different currency
//     preference.

// 14. If a saved currency preference exists,
//     respect that preference.

// 15. If reportFormat exists, format large
//     financial values according to that
//     preference.

// 16. Never perform currency conversion unless
//     conversion information was explicitly
//     supplied.


// =========================================
// GENERAL CHAT
// =========================================

// 17. For GENERAL_CHAT:

//     Respond naturally and conversationally.

// 18. Do not provide business statistics unless
//     the admin asks for them and the required
//     analytics data is available.

// 19. For greetings, acknowledgements,
//     preferences, or simple conversation,
//     do not force analytics into the response.


// =========================================
// BUSINESS OVERVIEW
// =========================================

// 20. For BUSINESS_OVERVIEW:

//     Mention only metrics actually supplied.

//     These may include:

//     - total revenue
//     - total orders
//     - delivered orders
//     - pending orders
//     - confirmed orders
//     - packed orders
//     - shipped orders
//     - out-for-delivery orders
//     - cancelled orders
//     - total products
//     - verified users

// 21. Total revenue must come only from the
//     supplied revenue metric.

// 22. Do not treat non-delivered order value
//     as completed revenue.

// 23. Do not infer:

//     - profit
//     - growth
//     - decline
//     - conversion rate
//     - business health

//     unless enough analytics exist to support
//     that conclusion.


// =========================================
// LOW STOCK
// =========================================

// 24. For LOW_STOCK:

//     Mention:

//     - product name
//     - current stock

// 25. Use the supplied threshold when available.

// 26. Stock = 0 means:

//     Out of Stock

// 27. Stock greater than 0 but at or below the
//     supplied low-stock threshold means:

//     Low Stock

// 28. If the lowStockProducts array is empty:

//     respond that no products currently require
//     restocking based on the configured
//     low-stock threshold.

// 29. Do NOT say:

//     "stock information is unavailable"

//     when an empty lowStockProducts array
//     was supplied.

// 30. Do not recommend an exact reorder quantity
//     unless enough supporting analytics exist.


// =========================================
// SALES ANALYSIS
// =========================================

// 31. For SALES_ANALYSIS:

//     Analyze ONLY supplied sales periods.

// 32. Mention:

//     - period/month
//     - year when relevant
//     - revenue
//     - order count

// 33. You may identify:

//     - highest-performing period
//     - lowest-performing period

//     using only supplied data.

// 34. You may calculate comparisons or
//     percentages only when all required
//     values are supplied.

// 35. Do not discuss months or periods absent
//     from ANALYTICS DATA.

// 36. Do not invent reasons for sales increases
//     or decreases.


// =========================================
// TOP PRODUCTS
// =========================================

// 37. For TOP_PRODUCTS:

//     Preserve the EXACT ORDER in which products
//     appear in ANALYTICS DATA.

// 38. The analytics service has already ranked
//     these products by units sold.

// 39. NEVER reorder the supplied ranking.

// 40. Mention:

//     - product name
//     - units sold
//     - revenue

// 41. The first supplied product represents the
//     top-selling product according to the
//     analytics ranking.

// 42. Do not assume the first product generated
//     the highest revenue unless the supplied
//     values establish that.

// 43. If discussing revenue separately,
//     clearly distinguish:

//     "highest revenue-generating product"

//     from:

//     "top-selling product by units"

// 44. Never change the supplied top-product
//     ranking simply because another product
//     generated more revenue.


// =========================================
// ORDER ANALYSIS
// =========================================

// 45. For ORDER_ANALYSIS:

//     Clearly distinguish:

//     - Pending
//     - Confirmed
//     - Packed
//     - Shipped
//     - Out For Delivery
//     - Delivered
//     - Cancelled

// 46. Use only statuses present in supplied
//     analytics.

// 47. Never treat Cancelled orders as
//     successful sales.

// 48. Never describe Pending orders as
//     delivered.

// 49. Never describe Confirmed orders as
//     delivered.

// 50. Never describe Packed orders as
//     delivered.

// 51. Never describe Shipped orders as
//     delivered.

// 52. Never describe Out For Delivery orders
//     as delivered.

// 53. A monetary "value" associated with an
//     order status represents order value for
//     that status.

// 54. Do NOT automatically describe that value
//     as recognized revenue.

// 55. Only Delivered order value may be
//     described as completed sales value when
//     supported by the supplied analytics.


// =========================================
// CATEGORY ANALYSIS
// =========================================

// 56. For CATEGORY_ANALYSIS:

//     Mention:

//     - category
//     - units sold
//     - revenue

// 57. Compare ONLY categories present in
//     supplied analytics.

// 58. Do not invent missing categories.

// 59. If supplied category analytics are sorted
//     by revenue, preserve that ranking.

// 60. Clearly distinguish category revenue
//     from units sold.


// =========================================
// INVENTORY
// =========================================

// 61. For INVENTORY:

//     Clearly distinguish:

//     - Healthy Stock
//     - Low Stock
//     - Out of Stock

// 62. Use the supplied threshold when available.

// 63. Stock = 0 means:

//     Out of Stock

// 64. Stock greater than 0 but at or below
//     the supplied threshold means:

//     Low Stock

// 65. Stock greater than the supplied threshold
//     means:

//     Healthy Stock

// 66. Mention available inventory counts.

// 67. If inventory value is supplied, display it
//     using the appropriate currency preference.

// 68. Inventory value represents the value of
//     current stock based on supplied product
//     price and stock data.

// 69. Do not describe inventory value as revenue.

// 70. Do not calculate additional inventory
//     metrics unless required values are supplied.


// =========================================
// EMPTY DATA HANDLING
// =========================================

// 71. Empty analytics results represent zero
//     matching records, not automatically
//     missing information.

// 72. Examples:

//     TOP_PRODUCTS + []

//     means no delivered product sales matched
//     the analytics query.


//     SALES_ANALYSIS + []

//     means no delivered sales periods matched
//     the analytics query.


//     CATEGORY_ANALYSIS + []

//     means no delivered category sales matched
//     the analytics query.


//     ORDER_ANALYSIS + []

//     means no order status records matched
//     the analytics query.

// 73. Never fabricate fallback analytics when
//     an empty result is supplied.


// =========================================
// RECOMMENDATIONS
// =========================================

// 74. Recommendations must be directly grounded
//     in supplied analytics.

// 75. You may recommend restocking an out-of-stock
//     or low-stock product.

// 76. You may highlight strong or weak performance
//     visible in supplied data.

// 77. Never invent:

//     - reorder quantities
//     - demand forecasts
//     - profit margins
//     - marketing causes
//     - customer behavior
//     - future sales

//     unless supporting data was supplied.


// =========================================
// RESPONSE STYLE
// =========================================

// 78. Keep the response concise, clear, and
//     useful for an e-commerce administrator.

// 79. Prefer readable business language over
//     technical language.

// 80. When multiple records are returned,
//     use short bullets or numbered points
//     when useful.

// 81. Do not mention:

//     - internal tools
//     - tool names
//     - database queries
//     - prompts
//     - APIs
//     - model names
//     - implementation details
//     - intent classification
//     - internal services

// 82. Do not say phrases such as:

//     - "According to the tool"
//     - "The database returned"
//     - "The analytics API says"
//     - "The prompt indicates"

// 83. Present the information directly as
//     Quickart business information.

// 84. Return plain text only.
// `;


//     // ========================================
//     // 7. ASK GROQ
//     // ========================================

//     const completion =
//       await groq.chat.completions.create({
//         model:
//           GROQ_MODEL,

//         messages: [
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],

//         temperature: 0.2,
//       });


//     // ========================================
//     // 8. EXTRACT FINAL ANSWER
//     // ========================================

//     const answer =
//       completion
//         ?.choices?.[0]
//         ?.message
//         ?.content
//         ?.trim();


//     // ========================================
//     // 9. EMPTY RESPONSE CHECK
//     // ========================================

//     if (!answer) {
//       console.warn(
//         "Admin AI returned empty response."
//       );

//       return {
//         intent,

//         tool:
//           toolResult.tool,

//         answer:
//           "Unable to generate response.",

//         data:
//           toolResult.data,
//       };
//     }


//     // ========================================
//     // 10. RETURN RESULT
//     // ========================================

//     return {
//       intent,

//       tool:
//         toolResult.tool,

//       answer,

//       data:
//         toolResult.data,
//     };

//   } catch (error) {

//     console.error(
//       "Admin AI Service Error:",
//       error
//     );

//     throw error;
//   }
// };

// services/adminAI.service.js

import {
  classifyAdminIntent,
} from "./adminIntent.service.js";

import {
  executeAdminTool,
} from "./adminToolExecutor.service.js";

import {
  getAI,
  GROQ_MODEL,
} from "./groq.service.js";

import {
  CHAT_PROMPT,
  getIntentPrompt,
} from "../prompts/chat.prompt.js";




// ==========================================
// GROQ CLIENT
// ==========================================

const groq = getAI();


// ==========================================
// GENERATE ADMIN AI RESPONSE
// ==========================================

export const generateAdminAIResponse = async (
  question,
  memories = {}
) => {
  try {

    // ========================================
    // 1. VALIDATE QUESTION
    // ========================================

    if (
      typeof question !== "string" ||
      !question.trim()
    ) {
      throw new Error(
        "Admin AI question is required."
      );
    }


    const cleanQuestion =
      question.trim();


    // ========================================
    // 2. CLASSIFY ADMIN INTENT
    // ========================================

    const intent =
      await classifyAdminIntent(
        cleanQuestion
      );


    console.log(
      "Admin AI Intent:",
      intent
    );


    // ========================================
    // 3. EXECUTE REQUIRED ANALYTICS TOOL
    // ========================================

    const toolResult =
      await executeAdminTool(
        intent
      );


    console.log(
      "Admin AI Tool:",
      toolResult.tool
    );


    console.log(
      "Admin AI Tool Data:",
      JSON.stringify(
        toolResult.data,
        null,
        2
      )
    );


    // ========================================
    // 4. BUILD MEMORY CONTEXT
    // ========================================

    const hasMemories =
      memories &&
      typeof memories === "object" &&
      !Array.isArray(memories) &&
      Object.keys(memories).length > 0;


    let memoryContext =
      "No saved admin preferences.";


    if (hasMemories) {

      memoryContext =
        Object.entries(memories)
          .map(
            ([key, value]) => {

              // --------------------------------
              // FORMAT OBJECT VALUES
              // --------------------------------

              if (
                value !== null &&
                typeof value === "object"
              ) {
                return (
                  `${key}: ${JSON.stringify(value)}`
                );
              }


              // --------------------------------
              // FORMAT NORMAL VALUES
              // --------------------------------

              return (
                `${key}: ${String(value)}`
              );
            }
          )
          .join("\n");
    }


    // ========================================
    // 5. BUILD ANALYTICS CONTEXT
    // ========================================

    // IMPORTANT:
    //
    // [] is VALID analytics data.
    //
    // {} is VALID analytics data.
    //
    // 0 is VALID analytics data.
    //
    // Only null / undefined mean that no
    // analytics data was required or supplied.

    const hasAnalyticsData =
      toolResult.data !== null &&
      toolResult.data !== undefined;


    const analyticsContext =
      hasAnalyticsData

        ? JSON.stringify(
            toolResult.data,
            null,
            2
          )

        : "No analytics data required.";


    // ========================================
    // 6. GET INTENT-SPECIFIC PROMPT
    // ========================================

    // Instead of sending instructions for
    // EVERY analytics type to Groq,
    //
    // we send only the instructions required
    // for the current intent.
    //
    // Example:
    //
    // BUSINESS_OVERVIEW
    //
    // gets only BUSINESS_OVERVIEW rules.
    //
    // LOW_STOCK
    //
    // gets only LOW_STOCK rules.

    const intentPrompt =
      getIntentPrompt(
        intent
      );


    // ========================================
    // 7. BUILD OPTIMIZED FINAL PROMPT
    // ========================================

    const prompt = `
${CHAT_PROMPT}


=========================================
CURRENT ADMIN INTENT
=========================================

${intent}


=========================================
CURRENT TASK RULES
=========================================

${intentPrompt}


=========================================
SAVED ADMIN PREFERENCES
=========================================

${memoryContext}


=========================================
ANALYTICS DATA
=========================================

${analyticsContext}


=========================================
ADMIN QUESTION
=========================================

${cleanQuestion}


=========================================
FINAL RESPONSE RULES
=========================================

1. Answer the administrator's actual
   question directly.

2. For business or analytics questions,
   use ONLY the supplied ANALYTICS DATA.

3. Never invent missing business data.

4. Never estimate missing business data.

5. Never replace missing analytics with
   assumptions or general knowledge.

6. Empty arrays and empty objects are
   valid analytics results.

7. Use saved admin preferences only when
   relevant.

8. Saved preferences must never override
   actual analytics data.

9. Do not expose raw analytics JSON unless
   the administrator explicitly asks for
   raw data.

10. Do not mention internal implementation.

11. Do not mention:

    - tools
    - databases
    - database queries
    - APIs
    - prompts
    - intent classification
    - model names
    - internal services

12. Keep the answer concise and useful.

13. Return plain text only.
`;


    // ========================================
    // 8. GENERATE GROQ RESPONSE
    // ========================================

    const completion =
      await groq.chat.completions.create({

        model:
          GROQ_MODEL,

        messages: [
          {
            role: "user",

            content:
              prompt,
          },
        ],


        // ------------------------------------
        // LOW TEMPERATURE
        // ------------------------------------
        //
        // Analytics answers should remain
        // deterministic and grounded.

        temperature:
          0.2,


        // ------------------------------------
        // LIMIT OUTPUT TOKENS
        // ------------------------------------
        //
        // Admin analytics responses should
        // remain concise.
        //
        // This also helps reduce token usage.

        max_tokens:
          700,
      });


    // ========================================
    // 9. EXTRACT FINAL ANSWER
    // ========================================

    const answer =
      completion
        ?.choices?.[0]
        ?.message
        ?.content
        ?.trim();


    // ========================================
    // 10. HANDLE EMPTY AI RESPONSE
    // ========================================

    if (!answer) {

      console.warn(
        "Admin AI returned an empty response."
      );


      return {

        intent,

        tool:
          toolResult.tool,

        answer:
          "Unable to generate response.",

        data:
          toolResult.data,
      };
    }


    // ========================================
    // 11. RETURN SUCCESS RESULT
    // ========================================

    return {

      intent,

      tool:
        toolResult.tool,

      answer,

      data:
        toolResult.data,
    };


  } catch (error) {

    // ========================================
    // 12. GROQ RATE LIMIT ERROR
    // ========================================

    if (
      error?.status === 429
    ) {

      console.error(
        "Admin AI Rate Limit Error:",
        error?.message
      );


      const rateLimitError =
        new Error(
          "AI service is temporarily busy. Please try again shortly."
        );


      rateLimitError.status =
        429;


      throw rateLimitError;
    }


    // ========================================
    // 13. GENERAL ERROR
    // ========================================

    console.error(
      "Admin AI Service Error:",
      error
    );


    throw error;
  }
};