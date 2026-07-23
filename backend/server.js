import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectdb from "./database/db.js";

// Routes
import userRoute from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js";
import productRoutes from "./routes/productRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

// =======================
// Middlewares
// =======================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://quickart-one.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// =======================
// Request Logger
// =======================

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// =======================
// Health Check
// =======================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Quickart Backend Running 🚀",
  });
});

// =======================
// API Routes
// =======================

app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/admin", adminRoutes);

// Admin AI
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/admin/ai", aiRoutes);

// Shopping AI Assistant
app.use("/api/v1/chat", chatRoutes);

// =======================
// 404 Handler
// =======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// =======================
// Start Server
// =======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await connectdb();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.log("Database Connection Failed");
    console.error(error);
  }
});