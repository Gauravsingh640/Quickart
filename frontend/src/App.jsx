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
          <Route path="userDetails" element={<UserDetails />}/>
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </>
  );
}

export default App;