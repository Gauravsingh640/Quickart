import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  toast,
} from "react-toastify";

import { useNavigate } from "react-router-dom";

function Orders() {

  const navigate = useNavigate();

  const [orders,
    setOrders] =
    useState([]);

  // FETCH ORDERS

  const fetchOrders =
  async () => {

    try {

      const res =
      await axios.get(

        "https://quickart-jxc5.onrender.com/api/v1/order/all-orders"
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

    <div className="adminOrdersContainer">

      <h1>
        Admin - All Orders
      </h1>

      <div className="adminOrdersTable">

        {/* HEADER */}

        <div className="adminOrdersHeader">

          <p>Order ID</p>

          <p>Customer</p>

          <p>Products</p>

          <p>Amount</p>

          <p>Status</p>

          <p>Date</p>

        </div>

        {/* ORDERS */}

        {

          orders.map((order) => (

            <div

              className="adminOrdersRow"

              key={order._id} 
              onClick={() => navigate( `/dashboard/order/${order._id}` )}
            >

              {/* ORDER ID */}

              <p className="orderIdText">

                {order._id}

              </p>

              {/* USER */}
 
              <p className="orderUserInfo">

                <img

                  src={

                    order.user?.profilePic ||

                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }

                  alt="Profile"

                  width="35"

                  height="35"
                />

                {order.user?.firstName}

                {" "}

                {order.user?.lastName}

              </p>


              {/* PRODUCTS */}

              <div className="adminProductsList">

                {

                  order.items.map(

                    (item,index) => (

                      <div

                        className="adminSingleOrderedProduct"

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

                            Qty:
                            {" "}

                            {
                              item.quantity
                            }

                          </p>

                          <p>

                            ₹
                            {
                              item.price.toFixed(2)
                            }

                          </p>

                        </div>

                      </div>
                    ))
                }

              </div>

              {/* AMOUNT */}

              <p>

                ₹
                {order.totalPrice.toFixed(2)}

              </p>

              {/* STATUS */}

              <p>

                <span

                  className={`adminOrderStatus ${order.status}`}
                >

                  {order.status}

                </span>

              </p>

              {/* DATE */}

              <p>

                {

                  new Date(

                    order.createdAt

                  ).toLocaleDateString()

                }

              </p>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default Orders;