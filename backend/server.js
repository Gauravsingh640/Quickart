import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectdb from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://quickart-one.vercel.app"
    ],
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Routes
app.use("/api/v1/user", userRoute);

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectdb();
});