import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useParams,
} from "react-router-dom";

function AdminSingleOrder(){

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

        alert(
        res.data.message
        );

        fetchOrder();

    }

    catch(error){

        console.log(error);

        alert(

        error.response
        ?.data
        ?.message
        );
    }
  };

  
  const cancelOrder =
    async () => {

    try {

        const res =
        await axios.put(

        `https://quickart-jxc5.onrender.com/api/v1/order/cancel/${id}`
        );

        alert(
        res.data.message
        );

        fetchOrder();

    }

    catch(error){

        console.log(error);
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

      
    {

        order.status ===
        "Pending"

        &&

        <div className="orderActions">

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

        </div>
    }


    </div>
  );
}

export default AdminSingleOrder;
