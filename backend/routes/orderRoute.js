import express from "express";

import {
  createOrder,
} from "../controllers/orderController.js";

import {
  isAuthenticated,
} from "../middleware/isAuthenticated.js";

const router =
  express.Router();

router.post(
  "/create",
  isAuthenticated,
  createOrder
);

export default router;