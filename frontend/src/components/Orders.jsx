import {

  useContext,
  useEffect,
  useState,

} from "react";

import axios from "axios";

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
    user,
  } = useContext(AuthContext);

  const [orders, setOrders] =
    useState([]);

  // FETCH ORDERS

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders =
    async () => {

      try {

        const token =
          sessionStorage.getItem(
            "token"
          );

        const res =
          await axios.get(

            "https://quickart-jxc5.onrender.com/api/v1/order/my",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          res.data
        );

        setOrders(
          res.data.orders
        );

      } catch (error) {

        console.log(error);
      }
    };

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
              key={order._id}
              className="order-card"
            >

              {/* HEADER */}

              <div className="order-header">

                <div>

                  <h2>

                    Order ID:
                    {" "}

                    {order._id}

                  </h2>

                  <h3>

                    User:
                    {" "}

                    {
                      user
                        ?.firstName
                    }

                    {" "}

                    {
                      user
                        ?.lastName
                    }

                  </h3>

                  <p>

                    Email:
                    {" "}

                    {
                      user
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

                    {order.totalPrice.toFixed(
                      2
                    )}

                  </h3>

                  <span>
                    {order.status}
                  </span>

                </div>

              </div>

              {/* PRODUCTS */}

              <h2 className="products-heading">
                Products:
              </h2>

              {
                order.items.map(
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