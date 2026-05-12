import express from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
const router = express.Router();
router.post("/create", isAuthenticated, createOrder);
router.get("/my", isAuthenticated, getMyOrders);
export default router;
