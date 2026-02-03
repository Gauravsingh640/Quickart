import express from 'express'
import dotenv from 'dotenv/config'
import connectdb from './database/db.js' 
import userRoute from './routes/userRoute.js'
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000
app.set('port', PORT)
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public')) // Serve static files from the 'public' directory
 
app.use("/api/v1/user", userRoute);

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`)
  next()
})
app.listen(PORT, () => {
  connectdb()
  console.log(`Server is running on http://localhost:${PORT}`)
})