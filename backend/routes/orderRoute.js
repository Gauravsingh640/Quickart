import express from "express";
import { createOrder, getAllOrders, getMyOrders, getUserOrders } from "../controllers/orderController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
const router = express.Router();
router.post("/create", isAuthenticated, createOrder);
router.get("/my", isAuthenticated, getMyOrders);
router.get("/user/:id", getUserOrders);
router.get("/all-orders", getAllOrders);
export default router;
