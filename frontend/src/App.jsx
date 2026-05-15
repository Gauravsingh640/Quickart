import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Orders from "./components/Orders";
import UserDetails from "./components/UserDetails";
import Dashboard from "./pages/Dashboard";
import ProductsAdmin from "./pages/ProductsAdmin";
import Sales from "./pages/Sales";
import AddProduct from "./pages/AddProduct";
import Users from "./pages/Users";
import Order from "./pages/Order";
import EditProduct from "./pages/EditProduct";
import UserOrders from "./pages/UserOrders";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />}>
          <Route index element={<UserDetails />} />
          <Route path="userDetails" element={<UserDetails />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Sales />}/>
          <Route path="sales" element={<Sales />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="/dashboard/products/:id" element={<EditProduct />}/>
          <Route path="users" element={<Users />} />
          <Route path="/dashboard/users/:id/orders" element={<UserOrders />}/>
          <Route path="orders" element={<Order />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
