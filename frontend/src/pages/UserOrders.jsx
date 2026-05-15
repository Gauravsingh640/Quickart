import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useParams,
} from "react-router-dom";

import {
  toast,
} from "react-toastify";

function UserOrders() {

  const { id } =
  useParams();

  const [orders,
    setOrders] =
    useState([]);

  // FETCH ORDERS

  const fetchOrders =
  async () => {

    try {

      const res =
      await axios.get(

        `http://localhost:8000/api/v1/order/user/${id}`
      );

      console.log(
        res.data.orders
      );

      setOrders(
        res.data.orders
      );

    }

    catch(error){

      console.log(error);

      toast.error(
        "Failed To Fetch Orders"
      );
    }
  };

  useEffect(() => {

    fetchOrders();

  }, []);

  return (

    <div className="userOrdersContainer">

      <h1>
        User Orders
      </h1>

      <br />

      {

        orders.length === 0

        ?

        <h2>
          No Orders Found
        </h2>

        :

        orders.map((order) => (

          <div

            className="singleUserOrderCard"

            key={order._id}
          >

            {/* TOP */}

            <div className="orderTopSection">

              <div>

                <h3>

                  Order ID:
                  {" "}

                  {order._id}

                </h3>

                <p>

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

                </p>

                <p>

                  Email:
                  {" "}

                  {
                    order.user
                    ?.email
                  }

                </p>

              </div>

              <div className="orderRightSide">

                <h3>

                  ₹
                  {order.totalPrice}

                </h3>

                <span

                  className={`orderStatus ${order.status}`}
                >

                  {order.status}

                </span>

              </div>

            </div>

            {/* PRODUCTS */}

            <div className="orderProductsSection">

              {

                order.items.map(

                  (item,index) => (

                    <div

                      className="singleOrderedProduct"

                      key={index}
                    >

                      {/* IMAGE */}

                      <img

                        src={
                          item.image 
                        }

                        alt=""
                      />

                      {/* INFO */}

                      <div>

                        <h4>

                          {
                            item.title
                          }

                        </h4>

                        <p>

                          ₹
                          {item.price}

                          {" "}
                          x
                          {" "}

                          {item.quantity}

                        </p>

                      </div>

                    </div>
                  ))
              }

            </div>

          </div>
        ))
      }

    </div>
  );
}

export default UserOrders;