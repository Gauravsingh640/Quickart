import {
  getOverviewAnalytics,
  getTopSellingProducts,
  getLowStockProducts,
  getMonthlySales,
} from "../services/analytics.service.js";

export const analyticsTools = {
  overview: async () => {
    return await getOverviewAnalytics();
  },

  topProducts: async () => {
    return await getTopSellingProducts();
  },

  lowStock: async () => {
    return await getLowStockProducts();
  },

  monthlySales: async () => {
    return await getMonthlySales();
  },
};