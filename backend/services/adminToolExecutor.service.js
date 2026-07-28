// services/adminToolExecutor.service.js
import {
  getOverviewAnalytics,
  getTopSellingProducts,
  getLeastSellingProducts,
  getLowStockProducts,
  getTodaySales,
  getWeeklySales,
  getMonthlySales,
  getCategorySales,
  getOrderAnalytics,
  getInventoryAnalytics,
} from "./analytics.service.js";

// ==========================================
// TOOL HANDLERS
// ==========================================

const TOOL_HANDLERS = {
  BUSINESS_OVERVIEW: getOverviewAnalytics,

  SALES_ANALYSIS: getMonthlySales,

  TODAY_SALES: getTodaySales,

  WEEKLY_SALES: getWeeklySales,

  TOP_PRODUCTS: getTopSellingProducts,

  LEAST_SELLING_PRODUCTS: getLeastSellingProducts,

  LOW_STOCK: getLowStockProducts,

  CATEGORY_ANALYSIS: getCategorySales,

  ORDER_ANALYSIS: getOrderAnalytics,

  INVENTORY: getInventoryAnalytics,
};


// ==========================================
// ADMIN TOOL EXECUTOR
// ==========================================

export const executeAdminTool = async (intent) => {
  try {
    // ========================================
    // 1. GENERAL CHAT
    // ========================================

    // GENERAL_CHAT does not require
    // any analytics query.

    if (intent === "GENERAL_CHAT") {
      return {
        tool: "GENERAL_CHAT",
        data: null,
      };
    }


    // ========================================
    // 2. FIND ANALYTICS HANDLER
    // ========================================

    const handler = TOOL_HANDLERS[intent];


    // ========================================
    // 3. INVALID / UNKNOWN INTENT
    // ========================================

    if (!handler) {
      console.warn(
        "Unknown Admin Tool Intent:",
        intent
      );

      return {
        tool: "GENERAL_CHAT",
        data: null,
      };
    }


    // ========================================
    // 4. EXECUTE ANALYTICS
    // ========================================

    const data = await handler();


    // ========================================
    // 5. RETURN TOOL RESULT
    // ========================================

    return {
      tool: intent,
      data,
    };

  } catch (error) {
    console.error(
      `Admin Tool Executor Error [${intent}]:`,
      error
    );

    throw error;
  }
};