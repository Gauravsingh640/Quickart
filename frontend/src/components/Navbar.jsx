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


function Navbar() {

  const navigate =
    useNavigate();

  const {
    user,
    setUser,
    cart,
  } = useContext(AuthContext);

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

    setUser(null);

    navigate("/login");
  };

  // CART CLICK

  const handleCart = () => {

    if (!user) {

      navigate("/login");

      return;
    }

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

              <span>0</span>

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