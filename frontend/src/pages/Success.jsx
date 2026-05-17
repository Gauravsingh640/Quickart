import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaCheckCircle,
} from "react-icons/fa";

function Success() {

  const navigate =
  useNavigate();

  const { id } =
  useParams();

  const [order,
    setOrder] =
    useState(null);

  useEffect(() => {

    fetchOrder();

  }, []);

  const fetchOrder =
  async () => {

    try {

      const res =
      await axios.get(

        `https://quickart-jxc5.onrender.com/api/v1/order/${id}`
      );

      setOrder(
        res.data.order
      );

    }

    catch(error){

      console.log(error);
    }
  };

  if(!order){

    return <h1>
      Loading...
    </h1>;
  }

  return (

    <div className="success-page">

      <div className="success-card">

        {/* ICON */}

        <FaCheckCircle
          className="success-icon"
        />

        {/* TEXT */}

        <h1>
          Order Successful 🎉
        </h1>

        <p>

          Thank you for shopping with us.
          Your order has been placed successfully.

        </p>

        {/* ORDER ID */}

        <div className="success-order-box">

          <h3>

            Order ID

          </h3>

          <p>

            {order._id}

          </p>

        </div>

        {/* DELIVERY CODE */}

        <div className="delivery-code-box">

          <h3>

            Delivery Code

          </h3>

          <h1>

            {
              order.deliveryCode
            }

          </h1>

          <p>

            Please share this code
            at the time of delivery.

          </p>

        </div>

        {/* BUTTONS */}

        <div className="success-btns">

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

    </div>
  );
}

export default Success;
