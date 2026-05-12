# QUICKART 🛒

A full-stack modern E-Commerce web application built using the MERN Stack with authentication, email verification, Razorpay payments, MongoDB order management, Cloudinary image uploads, and responsive UI.

🚀 Features

🔐 Authentication & Security: 
1. User Registration & Login
2. JWT Authentication
3. Protected Routes
4. Session Management
5. Email Verification System
6. Re-Verification Email Support
7. Logout Functionality

👤 User Features:
1. Update Profile
2. Upload Profile Picture
3. Cloudinary Image Storage
4. Persistent Cart using LocalStorage
5. Product Search & Filtering
6. Product Details Page 
7. Checkout Flow
8. Razorpay Payment Gateway Integration
9. Order History
10. MongoDB Order Storage

🛍️ Product Features:
1. Product Listing
2. Category Filtering
3. Brand Filtering
4. Price Filtering
5. Sorting (Low to High / High to Low)
6. Product Detail View

💳 Payment System
1. Razorpay Payment Integration
2. Secure Checkout Flow
3. Payment Success Handling
4. Automatic Order Creation
5. Cart Clearing After Successful Payment

📦 Order Management
1. Store Orders in MongoDB
2. Fetch Logged-In User Orders
3. Display Ordered Products
4. Order Status Support

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router DOM
- Context API
- Axios
- React Toastify
- React Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js
- Nodemailer
- Multer

---

## Cloud & Services

- Cloudinary
- Razorpay
- Render
- Vercel
- Brevo SMTP

---

# 📁 Project Structure

```bash
QUICKART/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── data/
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
# ⚙️ Installation:
```bash
 1. Clone Repository
    git clone <your-repository-url>

 2. Install Dependencies
    Frontend
        cd frontend
        npm install
    Backend
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
Backend
npm run dev
Frontend
npm run dev
```

# 🌐 Deployment
```bash
Frontend : Vercel
Backend : Render
```
# 👨‍💻 Author
Gaurav Singh