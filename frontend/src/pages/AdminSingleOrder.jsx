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

import "./AdminSingleOrder.css";


function AdminSingleOrder() {

  const { id } =
    useParams();

  const [order,
    setOrder] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const [deliveryCode,
    setDeliveryCode] =
    useState("");


  // =========================================
  // BASE URL
  // =========================================

  const BASE_URL =
    "https://quickart-jxc5.onrender.com/api/v1/order";


  // =========================================
  // FETCH SINGLE ORDER
  // =========================================

  const fetchOrder =
    async () => {

      try {

        // setLoading(true);

        const res =
          await axios.get(

            `${BASE_URL}/${id}`

          );

        console.log(
          "Single Order Response:",
          res.data
        );

        setOrder(
          res.data.order
        );

      }

      catch (error) {

        console.error(
          "Fetch Order Error:",
          error
        );

        console.error(
          "Backend Response:",
          error.response?.data
        );

        setOrder(null);

        toast.error(

          error.response?.data?.message ||

          "Failed to fetch order"
        );

      }

      finally {

        setLoading(false);

      }
    };


  // =========================================
  // LOAD ORDER
  // =========================================

  useEffect(() => {

    if (id) {

      fetchOrder();

    }

  }, [id]);


  // =========================================
  // CONFIRM ORDER
  // =========================================

  const confirmOrder =
    async () => {

      try {

        await axios.put(

          `${BASE_URL}/confirm/${id}`

        );

        toast.success(
          "Order confirmed successfully"
        );

        await fetchOrder();

      }

      catch (error) {

        console.error(
          "Confirm Order Error:",
          error
        );

        toast.error(

          error.response?.data?.message ||

          "Failed to confirm order"
        );

      }
    };


  // =========================================
  // CANCEL ORDER
  // =========================================

  const cancelOrder =
    async () => {

      try {

        await axios.put(

          `${BASE_URL}/cancel/${id}`

        );

        toast.success(
          "Order cancelled successfully"
        );

        await fetchOrder();

      }

      catch (error) {

        console.error(
          "Cancel Order Error:",
          error
        );

        toast.error(

          error.response?.data?.message ||

          "Failed to cancel order"
        );

      }
    };


  // =========================================
  // UPDATE ORDER STATUS
  // =========================================

  const updateStatus =
    async (status) => {

      try {

        await axios.put(

          `${BASE_URL}/status/${id}`,

          {
            status,
          }

        );

        toast.success(
          "Status updated successfully"
        );

        await fetchOrder();

      }

      catch (error) {

        console.error(
          "Update Status Error:",
          error
        );

        toast.error(

          error.response?.data?.message ||

          "Failed to update status"
        );

      }
    };


  // =========================================
  // VERIFY DELIVERY
  // =========================================

  const verifyDelivery =
    async () => {

      if (
        !deliveryCode.trim()
      ) {

        toast.error(
          "Please enter delivery code"
        );

        return;
      }

      try {

        await axios.put(

          `${BASE_URL}/deliver/${id}`,

          {
            deliveryCode:
              deliveryCode.trim(),
          }

        );

        toast.success(
          "Delivery verified successfully"
        );

        setDeliveryCode("");

        await fetchOrder();

      }

      catch (error) {

        console.error(
          "Verify Delivery Error:",
          error
        );

        toast.error(

          error.response?.data?.message ||

          "Failed to verify delivery"
        );

      }
    };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="adminSingleOrderPage">

        <h1>
          Loading...
        </h1>

      </div>

    );
  }


  // =========================================
  // ORDER NOT FOUND
  // =========================================

  if (!order) {

    return (

      <div className="adminSingleOrderPage">

        <h1>
          Order Not Found
        </h1>

        <p>
          Unable to load this order.
        </p>

      </div>

    );
  }


  return (

    <div className="adminSingleOrderPage">


      {/* =====================================
          TOP
      ===================================== */}

      <div className="singleOrderTop">

        <div>

          <h1>
            Order Details
          </h1>

          <p>

            Order ID:
            {" "}
            {order._id}

          </p>

          <p>

            Date:
            {" "}

            {
              order.createdAt
                ?
                new Date(
                  order.createdAt
                ).toLocaleDateString()
                :
                "N/A"
            }

          </p>

        </div>


        <div>

          <span

            className={`singleOrderStatus ${
              order.status
                ?
                order.status.replaceAll(
                  " ",
                  "-"
                )
                :
                ""
            }`}
          >

            {order.status}

          </span>

        </div>

      </div>


      {/* =====================================
          CUSTOMER
      ===================================== */}

      <div className="singleOrderBox">

        <h2>
          Customer Details
        </h2>


        <div className="customerInfo">

          <img

            src={

              order.user?.profilePic ||

              "https://cdn-icons-png.flaticon.com/512/149/149071.png"

            }

            alt="Customer"
          />


          <div>

            <h3>

              {
                order.user?.firstName ||
                "Unknown"
              }

              {" "}

              {
                order.user?.lastName ||
                ""
              }

            </h3>


            <p>

              {
                order.user?.email ||
                "Email not available"
              }

            </p>

          </div>

        </div>

      </div>


      {/* =====================================
          PRODUCTS
      ===================================== */}

      <div className="singleOrderBox">

        <h2>
          Ordered Products
        </h2>


        {

          order.items?.length > 0

          ?

          order.items.map(

            (item, index) => (

              <div

                className="singleOrderedItem"

                key={
                  item._id ||
                  index
                }
              >

                <img

                  src={
                    item.image ||
                    "https://via.placeholder.com/100"
                  }

                  alt={
                    item.title ||
                    "Product"
                  }

                />


                <div>

                  <h3>

                    {
                      item.title ||
                      "Product"
                    }

                  </h3>


                  <p>

                    Quantity:
                    {" "}

                    {
                      item.quantity ||
                      0
                    }

                  </p>


                  <p>

                    ₹

                    {
                      Number(
                        item.price || 0
                      ).toFixed(2)
                    }

                  </p>

                </div>

              </div>

            )
          )

          :

          (

            <p>
              No products found.
            </p>
          )

        }

      </div>


      {/* =====================================
          PAYMENT
      ===================================== */}

      <div className="singleOrderBox">

        <h2>
          Payment
        </h2>

        <h3>

          Total:
          {" "}

          ₹

          {
            Number(
              order.totalPrice || 0
            ).toFixed(2)
          }

        </h3>

      </div>


      {/* =====================================
          ACTIONS
      ===================================== */}

      <div className="orderActions">


        {/* PENDING */}

        {

          order.status ===
          "Pending"

          &&

          <>

            <button

              className="confirmBtn"

              onClick={
                confirmOrder
              }
            >

              Confirm Order

            </button>


            <button

              className="cancelBtn"

              onClick={
                cancelOrder
              }
            >

              Cancel Order

            </button>

          </>

        }


        {/* CONFIRMED */}

        {

          order.status ===
          "Confirmed"

          &&

          <button

            className="confirmBtn"

            onClick={() =>
              updateStatus(
                "Packed"
              )
            }
          >

            Mark As Packed

          </button>

        }


        {/* PACKED */}

        {

          order.status ===
          "Packed"

          &&

          <button

            className="confirmBtn"

            onClick={() =>
              updateStatus(
                "Shipped"
              )
            }
          >

            Mark As Shipped

          </button>

        }


        {/* SHIPPED */}

        {

          order.status ===
          "Shipped"

          &&

          <button

            className="confirmBtn"

            onClick={() =>
              updateStatus(
                "Out For Delivery"
              )
            }
          >

            Out For Delivery

          </button>

        }


        {/* OUT FOR DELIVERY */}

        {

          order.status ===
          "Out For Delivery"

          &&

          <div className="deliveryVerifyBox">

            <input

              type="text"

              placeholder=
                "Enter Delivery Code"

              value={
                deliveryCode
              }

              onChange={(e) =>

                setDeliveryCode(

                  e.target.value
                    .toUpperCase()

                )
              }

            />


            <button

              className="confirmBtn"

              onClick={
                verifyDelivery
              }
            >

              Verify & Deliver

            </button>

          </div>

        }


        {/* DELIVERED */}

        {

          order.status ===
          "Delivered"

          &&

          <p>
            Order Delivered Successfully
          </p>

        }


        {/* CANCELLED */}

        {

          order.status ===
          "Cancelled"

          &&

          <p>
            Order Cancelled
          </p>

        }

      </div>

    </div>

  );
}


export default AdminSingleOrder;