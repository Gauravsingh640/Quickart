import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaShoppingCart,
} from "react-icons/fa";

import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";
import { toast } from "react-toastify";


function Navbar() {

  const navigate =
    useNavigate();

  const {
    user,
    setUser,
    cart,
    setCart,
  } = useContext(AuthContext);

  console.log("NAVBAR USER:", user);
  // TOTAL CART ITEMS

  const totalItems =
    cart.reduce(

      (acc, item) =>

        acc + item.quantity,

      0
    );
    // PROFILE

    const handleProfile = () => {
        if (!user) {
            navigate("/login");
            return;
        }
        navigate("/profile");
    };

  // LOGOUT

  const handleLogout = () => {

    // REMOVE SESSION
    sessionStorage.removeItem("user");

    sessionStorage.removeItem("token");

    // LOAD GUEST CART
    sessionStorage.removeItem("guestCart");
    setCart([]);
    setUser(null);

    toast.success("Logged Out Successfully");

    navigate("/login");
  };

  // CART CLICK

  const handleCart = () => {

    navigate("/cart");
  };

   
  return (

    <nav className="navbar">

      <h2 className="logo">
        🛒QUICKART
      </h2>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/products">
          Products
        </Link>

        {/* AFTER LOGIN */}

        {user ? (

          <>

            <h4 style={{ cursor: "pointer" }} onClick={handleProfile}>
              Hello,
              {" "}
              {user.name ||
               user.firstName}
            </h4>

            {/* ADMIN DASHBOARD LINK */}

            {user?.role === "admin"||user?.role === "superAdmin"?
              <Link to="/dashboard"> Dashboard </Link> : null
            }

            <div
              className="cart"
              onClick={handleCart}
            >

              <FaShoppingCart />

              <span>
                {totalItems}
              </span>

            </div>

            <button
              onClick={
                handleLogout
              }
            >
              Logout
            </button>

          </>

        ) : (

          <>
            <div
              className="cart"
              onClick={handleCart}
            >

              <FaShoppingCart />

              <span>{totalItems}</span>

            </div>

            <button
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>
          </>

        )}

      </div>

    </nav>
  );
}

export default Navbar;