import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";

function AdminSingleOrder(){

  const { id } =
  useParams();

  const [order,
    setOrder] =
    useState(null);

  useEffect(() => {

    fetchOrder();

  }, []);

  const [deliveryCode, setDeliveryCode] = useState("");

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

    return(

      <h1>
        Loading...
      </h1>
    );
  }
 
  const confirmOrder =
  async () => {

    try {

        const res =
        await axios.put(

        `https://quickart-jxc5.onrender.com/api/v1/order/confirm/${id}`
        );

        toast.success("Order confirmed successfully");

        fetchOrder();

    }

    catch(error){

        console.log(error);

        toast.error("Failed to confirm order");
        
    }
  };

  
  const cancelOrder =
    async () => {

    try {

        const res =
        await axios.put(

        `https://quickart-jxc5.onrender.com/api/v1/order/cancel/${id}`
        );

        toast.success("Order cancelled successfully");

        fetchOrder();

    }

    catch(error){

        console.log(error);
        toast.error("Failed to cancel order");
    }
  };
   
  const updateStatus =
  async (status) => {

    try {

      const res =
      await axios.put(

        `https://quickart-jxc5.onrender.com/api/v1/order/status/${id}`,

        { status }
      );

      toast.success("Status updated successfully");

      fetchOrder();

    }

    catch(error){

      toast.error("Failed to update status");

      console.log(error);
    }
  };
 
  const verifyDelivery =
  async () => {

    try {

      const res =
      await axios.put(

        `https://quickart-jxc5.onrender.com/api/v1/order/deliver/${id}`,

        {

          deliveryCode,
        }
      );

      toast.success("Delivery verified successfully");

      fetchOrder();

    }

    catch(error){

      toast.error("Failed to verify delivery");
    }
  }; 


  return (

    <div className="adminSingleOrderPage">

      {/* TOP */}

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

              new Date(

                order.createdAt

              ).toLocaleDateString()
            }

          </p>

        </div>

        <div>

          <span

            className={`singleOrderStatus ${order.status}`}
          >

            {order.status}

          </span>

        </div>

      </div>

      {/* CUSTOMER */}

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

            alt=""
          />

          <div>

            <h3>

              {
                order.user?.firstName
              }

              {" "}

              {
                order.user?.lastName
              }

            </h3>

            <p>

              {
                order.user?.email
              }

            </p>

          </div>

        </div>

      </div>

      {/* PRODUCTS */}

      <div className="singleOrderBox">

        <h2>
          Ordered Products
        </h2>

        {

          order.items.map(

            (item,index) => (

              <div

                className="singleOrderedItem"

                key={index}
              >

                <img

                  src={item.image}

                  alt=""
                />

                <div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>

                    Quantity:
                    {" "}

                    {item.quantity}

                  </p>

                  <p>

                    ₹
                    {item.price.toFixed(2)}

                  </p>

                </div>

              </div>
            ))
        }

      </div>

      {/* PAYMENT */}

      <div className="singleOrderBox">

        <h2>
          Payment
        </h2>

        <h3>

          Total:
          {" "}

          ₹
          {order.totalPrice.toFixed(2)}

        </h3>

      </div>
 
      {/* ACTIONS */}

      <div className="orderActions">

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
 
      {

        order.status ===
        "Out For Delivery"

        &&

        <div className="deliveryVerifyBox">

          <input

            type="text"

            placeholder="Enter Delivery Code"

            value={deliveryCode}

            onChange={(e) =>
              setDeliveryCode(
                e.target.value.toUpperCase()
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


      </div>


    </div>
  );
}

export default AdminSingleOrder;
