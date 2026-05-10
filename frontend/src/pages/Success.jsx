// Success.jsx

import {
  useNavigate,
} from "react-router-dom";

import {
  FaCheckCircle,
} from "react-icons/fa";
 

function Success() {

  const navigate =
    useNavigate();

  return (

    <div className="success-page">

      <div className="success-card">

        {/* ICON */}

        <FaCheckCircle
          className="success-icon"
        />

        {/* TEXT */}

        <h1>
          Payment Successful 🎉
        </h1>

        <p>

          Thank you for your purchase!

          Your order has been
          placed successfully.

        </p>

        {/* BUTTONS */}

        <button
          className=
            "continue-btn"

          onClick={() =>
            navigate(
              "/products"
            )
          }
        >
          Continue Shopping
        </button>

        <button
          className=
            "orders-btn"

          onClick={() =>
            navigate(
              "/profile/orders"
            )
          }
        >
          View My Orders
        </button>

      </div>

    </div>
  );
}

export default Success;