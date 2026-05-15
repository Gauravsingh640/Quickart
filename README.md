# QUICKART 🛒

A modern Full-Stack MERN E-Commerce Application featuring secure authentication, Razorpay payments, Cloudinary image uploads, MongoDB order management, email verification, guest cart system, and responsive admin dashboard.

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
* MongoDB Order Storage
 

## 🛍️ Product Features

* Product Listing
* Add Product (Admin)
* Edit Product (Admin)
* Delete Product (Admin)
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
* Order Status Support

  * Pending
  * Paid
  * Failed
* Selected Address Storage
* Order Confirmation Email
 

## 💳 Payment System

* Razorpay Payment Integration
* Secure Checkout Flow
* Payment Success Handling
* Automatic Order Creation
* Cart Clearing After Successful Payment
* Delivery Address Selection
* Brevo Email Integration
 

## 📊 Admin Dashboard

* Manage Products
* Manage Orders
* User Order Tracking
* Product Image Management
* Dynamic Order Status Display
* Sales Dashboard UI
 

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
 

## Cloud & Services

* Cloudinary
* Razorpay
* Render
* Vercel
* Brevo SMTP
* Brevo Transactional Email API
 

# 📁 Project Structure

```bash
QUICKART/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── assets/
│   ├── styles/
│   └── App.jsx
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
└── README.md
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
* Cloudinary multiple image uploads
* Responsive modern UI
* Secure payment integration
* MongoDB-based order tracking
 

# 🌐 Deployment

```bash
Frontend : Vercel
Backend  : Render
Database : MongoDB Atlas
```
 

# 👨‍💻 Author

Gaurav Singh
