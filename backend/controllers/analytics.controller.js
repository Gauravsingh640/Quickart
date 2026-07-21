import { getOverviewAnalytics } from "../services/analytics.service.js";
import { getTopSellingProducts } from "../services/analytics.service.js";
import { getLowStockProducts } from "../services/analytics.service.js";
import { getMonthlySales } from "../services/analytics.service.js"

export const overviewAnalytics = async (req, res) => {
  try {
    const data = await getOverviewAnalytics();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const topSellingProducts = async (req, res) => {
  try {
    const data = await getTopSellingProducts();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const lowStockProducts = async (req, res) => {
  try {
    const data = await getLowStockProducts();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const monthlySales = async (req, res) => {
  try {
    const data = await getMonthlySales();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 