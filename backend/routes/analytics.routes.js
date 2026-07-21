import express from "express";
import {
  overviewAnalytics,
  topSellingProducts,
  lowStockProducts,
  monthlySales, 
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/overview", overviewAnalytics);

router.get("/top-products", topSellingProducts);

router.get("/low-stock", lowStockProducts);

router.get("/monthly-sales", monthlySales);
 

export default router;