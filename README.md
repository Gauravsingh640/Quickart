# QUICKART 🛒🤖

A Full-Stack AI Powered MERN E-Commerce Platform featuring secure authentication, AI Sales Assistant, Razorpay payments, Cloudinary image uploads, MongoDB order management, delivery verification, intelligent business analytics, stock management, and responsive admin dashboard.

# 🚀 Features

## 🔐 Authentication & Security

* User Registration & Login
* JWT Authentication
* Protected Routes
* Session Management
* Email Verification System
* Re-Verification Email Support
* Logout Functionality
* Guest Cart Support
* Cart Merge After Login
* Persistent User Cart
* Multiple Address Management
* Address Selection During Checkout
* Order Confirmation Email
* Delivery Success Email
* Responsive Checkout UI


## 👤 User Features

* Update Profile
* Upload Profile Picture
* Cloudinary Image Storage
* Persistent Cart using LocalStorage
* Product Search & Filtering
* Product Details Page
* Dynamic Product Images
* Add To Cart / Quantity Management
* Checkout Flow
* Razorpay Payment Gateway Integration
* Order History
* Delivery Verification Code System
* Copy Delivery Code Feature
* MongoDB Order Storage


## 🛍️ Product Features

* Product Listing
* Add Product (Admin)
* Edit Product (Admin)
* Delete Product (Admin)
* Dynamic Stock Management
* Auto Stock Reduction on Order Confirm
* Out Of Stock Detection
* Multiple Product Image Upload
* Category Filtering
* Brand Filtering
* Price Filtering
* Sorting (Low to High / High to Low)
* Product Detail View


## 📦 Order Management

* Store Orders in MongoDB
* Fetch Logged-In User Orders
* Display Ordered Products
* Admin Order Dashboard
* Dynamic Order Status Workflow

  * Pending
  * Confirmed
  * Packed
  * Shipped
  * Out For Delivery
  * Delivered
  * Cancelled
  * Failed

* Automatic Order Cancellation on Insufficient Stock
* Delivery Verification Code Validation
* Selected Address Storage
* Order Confirmation Email
* Delivery Success Email
* Admin Delivery Verification System


## 💳 Payment System

* Razorpay Payment Integration
* Secure Checkout Flow
* Payment Success Handling
* Automatic Order Creation
* Cart Clearing After Successful Payment
* Delivery Address Selection
* Brevo Email Integration
* Transactional Email Support


## 📊 Admin Dashboard

* Manage Products
* Manage Orders
* User Order Tracking
* Product Image Management
* Dynamic Order Status Display
* Real-Time Stock Updates
* Sales Dashboard
* Business Analytics
* AI Sales Assistant
* Inventory Insights
* Monthly Sales Reports
* Delivery Workflow Management

# 🤖 AI Sales Assistant

The platform includes an intelligent AI-powered Sales Assistant built using Google's Gemini API.

### Features

* AI-powered business assistant
* Natural language business queries
* Agentic AI architecture
* Intelligent tool selection
* Business overview analytics
* Monthly sales analysis
* Top selling product insights
* Low stock recommendations
* AI-generated business recommendations
* ChatGPT-style conversational interface
* Real-time analytics from MongoDB


# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Context API
* Axios
* React Toastify
* React Icons


## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt.js
* Nodemailer
* Multer
* Gemini API


## Cloud & Services

* Cloudinary
* Razorpay
* Render
* Vercel
* MongoDB Atlas
* Brevo SMTP
* Brevo Transactional Email API

# 🧠 AI Architecture

```bash
User Question
      │
      ▼
AI Planner (Gemini)
      │
      ▼
Tool Selection
      │
      ▼
Analytics Tool
      │
      ▼
MongoDB
      │
      ▼
Gemini Response
      │
      ▼
AI Sales Assistant
```
 

# ⚙️ Installation

```bash
# Clone Repository
git clone <your-repository-url>

# Frontend Setup
cd frontend
npm install

# Backend Setup
cd backend
npm install
```
 

# 🔑 Environment Variables

```bash
PORT=8000

MONGO_URI=your_mongodb_url

JWT_SECRET=your_jwt_secret

MAIL_USER=your_email
MAIL_PASS=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret

BREVO_API_KEY=your_brevo_api_key
GEMINI_API_KEY=your_gemini_api_key
```
 

# ▶️ Run Project

```bash
# Backend
npm run dev

# Frontend
npm run dev
```
 
# ✨ Advanced Features

* Guest users can add items to cart
* Guest cart automatically merges after login
* Persistent cart for logged-in users
* Multiple delivery address support
* Dynamic address selection during checkout
* Email verification system
* Order confirmation emails
* Delivery success emails
* Dynamic stock management
* Automatic stock deduction
* Delivery verification code workflow
* Admin order lifecycle management
* Cloudinary multiple image uploads
* Responsive modern UI
* Secure payment integration
* MongoDB-based order tracking
* AI-powered Sales Assistant
* Business analytics chatbot
* Monthly sales insights
* Inventory intelligence
* Agentic AI workflow
* Real-time analytics from MongoDB
 

# 🌐 Deployment

```bash
Frontend : Vercel
Backend  : Render
Database : MongoDB Atlas
AI Model : Google Gemini
```
# 🌐 Live Demo

```bash
Frontend : https://quickart-one.vercel.app
Backend : https://quickart-jxc5.onrender.com
```

# 👨‍💻 Author
```bash
Gaurav Singh

```
