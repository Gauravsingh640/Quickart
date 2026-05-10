import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import connectdb from './database/db.js' 
import userRoute from './routes/userRoute.js'
const app = express();
import cors from "cors"; 
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT || 3000
app.set('port', PORT)
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public')) // Serve static files from the 'public' directory
 
app.use("/api/v1/user", userRoute);

// Middleware for logging requests

app.use((req, res, next) => {
  res.json({
    success: true,
    message: "Email Verified Successfully",
  });
  console.log(`${req.method} request for '${req.url}'`)
  next()
})

app.listen(PORT, () => {
  connectdb()
  console.log(`Server is running on http://localhost:${PORT}`)
})