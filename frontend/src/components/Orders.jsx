// Orders.jsx

import {
  useContext,
} from "react";

import {
  FaArrowLeft,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";
 

function Orders() {

  const navigate =
    useNavigate();

  const {
    orders,
  } = useContext(AuthContext);

  // NO ORDERS

  if (
    orders.length === 0
  ) {

    return (

      <div className="orders-page">

        <div className="orders-top">

          <button
            className="back-btn"

            onClick={() =>
              navigate("/")
            }
          >
            <FaArrowLeft />
          </button>

          <h1>
            Orders
          </h1>

        </div>

        <h2>
          No Orders Found
        </h2>

      </div>
    );
  }

  return (

    <div className="orders-page">

      {/* TOP */}

      <div className="orders-top">

        <button
          className="back-btn"

          onClick={() =>
            navigate("/")
          }
        >
          <FaArrowLeft />
        </button>

        <h1>
          Orders
        </h1>

      </div>

      {/* ALL ORDERS */}

      {
        orders.map(
          (order) => (

            <div
              key={order.id}
              className="order-card"
            >

              {/* HEADER */}

              <div className="order-header">

                <div>

                  <h2>

                    Order ID:
                    {" "}

                    {order.id}

                  </h2>

                  <h3>

                    User:
                    {" "}

                    {
                      order.user
                        ?.firstName
                    }

                    {" "}

                    {
                      order.user
                        ?.lastName
                    }

                  </h3>

                  <p>

                    Email:
                    {" "}

                    {
                      order.user
                        ?.email
                    }

                  </p>

                </div>

                <div className="order-right">

                  <h3>

                    Amount:
                    {" "}

                    INR
                    {" "}

                    {order.total.toFixed(
                      2
                    )}

                  </h3>

                  <span>
                    Paid
                  </span>

                </div>

              </div>

              {/* PRODUCTS */}

              <h2 className="products-heading">
                Products:
              </h2>

              {
                order.products.map(
                  (
                    item
                  ) => (

                    <div
                      key={
                        item.id
                      }

                      className="order-product"
                    >

                      {/* IMAGE */}

                      <img
                        src={
                          item.image
                        }

                        alt=""
                      />

                      {/* TITLE */}

                      <div className="product-info">

                        <h3>
                          {
                            item.title
                          }
                        </h3>

                      </div>

                      {/* PRICE */}

                      <h3>

                        ₹
                        {
                          item.price
                        }

                        {" "}
                        x
                        {" "}
                        {
                          item.quantity
                        }

                      </h3>

                    </div>
                  )
                )
              }

            </div>
          )
        )
      }

    </div>
  );
}

export default Orders;