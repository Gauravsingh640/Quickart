// Checkout.jsx

import {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";
import { toast } from "react-toastify";
 

function Checkout() {

  const navigate =
    useNavigate();

  // ADDRESS FORM

  const [showForm, setShowForm] =
    useState(false);

  const {

  cart,
  setCart,

  user,

  discount, 
  orders,
  setOrders,

} = useContext(AuthContext);

  // SAVED ADDRESSES

  const [addresses, setAddresses] =
    useState([
      {
        fullName: "Rohit Singh",
        phone: "123456789",
        email:
          "rohitsingh280504+2@gmail.com",
        address:
          "mai nhi bataunga",
        city: "kolkata",
        state: "LA",
        zipCode: "70005",
        country: "United States",
      },
    ]);

  // FORM DATA

  const [formData, setFormData] =
    useState({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });

  // INPUT CHANGE

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // SAVE ADDRESS

  const saveAddress = (e) => {

    e.preventDefault();

    setAddresses([
      ...addresses,
      formData,
    ]);

    setFormData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });

    setShowForm(false);
  };

  // DELETE ADDRESS

  const deleteAddress = (index) => {

    const updated =
      addresses.filter(
        (_, i) => i !== index
      );

    setAddresses(updated);
  };

  // TOTALS

  const subtotal =
    cart.reduce(

      (acc, item) =>

        acc +
        item.price *
          item.quantity,

      0
    );

  const shipping = 90.00;

  const tax =
    subtotal * 0.05;

  const total =
    subtotal +
    shipping +
    tax -
    discount;

  // PAYMENT

  const handlePayment = () => {

  if (cart.length === 0) {

    alert("Cart is Empty");

    return;
  }

  const options = {

    key:
      "rzp_test_SbA8xxgskiDGuP",

    amount:
      Math.round(total * 100),

    currency: "INR",

    name: "KART",

    description:
      "Order Payment",

    image:
      "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",

    handler: function (
      response
    ) {

      console.log(
        response
      );

      toast.success(
        "Payment Successful"
      );

      const newOrder = {

  id:
    Date.now(),

  user,

  products: cart,

  total,

  paymentStatus:
    "Paid",
};

// SAVE ORDER

setOrders([
  ...orders,
  newOrder,
]);

// CLEAR CART

setCart([]);

// SUCCESS

navigate("/success");
    },

    prefill: {

      name:
        user?.firstName ||
        "Guest User",

      email:
        user?.email ||
        "guest@gmail.com",

      contact:
        user?.phoneNo ||
        "9999999999",
    },

    theme: {
      color: "#e60073",
    },
  };

  const razorpay =
    new window.Razorpay(
      options
    );

  razorpay.open();
};

  return (

    <div className="checkout-page">

      {/* LEFT */}

      <div className="checkout-left">

        {/* ADDRESSES */}

        <h2>
          Saved Addresses
        </h2>

        {
          addresses.map(
            (item, index) => (

              <div
                className="address-card"
                key={index}
              >

                <div>

                  <h3>
                    {item.fullName}
                  </h3>

                  <p>
                    {item.phone}
                  </p>

                  <p>
                    {item.email}
                  </p>

                  <p>

                    {item.address},
                    {" "}
                    {item.city},
                    {" "}
                    {item.state},
                    {" "}
                    {item.zipCode},
                    {" "}
                    {item.country}

                  </p>

                </div>

                <span
                  className="delete-btn"

                  onClick={() =>
                    deleteAddress(
                      index
                    )
                  }
                >
                  Delete
                </span>

              </div>
            )
          )
        }

        {/* ADD ADDRESS BUTTON */}

        <button
          className=
            "add-address-btn"

          onClick={() =>
            setShowForm(
              !showForm
            )
          }
        >

          + Add New Address

        </button>

        {/* FORM */}

        {showForm && (

          <form
            className=
              "address-form"

            onSubmit={
              saveAddress
            }
          >

            <input
              type="text"
              name="fullName"
              placeholder=
                "Full Name"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="text"
              name="phone"
              placeholder=
                "Phone Number"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="text"
              name="address"
              placeholder=
                "Address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              required
            />

            <div className="input-row">

              <input
                type="text"
                name="city"
                placeholder="City"
                value={
                  formData.city
                }
                onChange={
                  handleChange
                }
                required
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={
                  formData.state
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="input-row">

              <input
                type="text"
                name="zipCode"
                placeholder=
                  "Zip Code"
                value={
                  formData.zipCode
                }
                onChange={
                  handleChange
                }
                required
              />

              <input
                type="text"
                name="country"
                placeholder=
                  "Country"
                value={
                  formData.country
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <button
              type="submit"
            >
              Save & Continue
            </button>

          </form>
        )}

        {/* PAYMENT */}

        <button
          className=
            "checkout-btn"

          onClick={
            handlePayment
          }
        >
          Proceed To Checkout
        </button>

      </div>

      {/* RIGHT */}

      <div className="checkout-right">

        <h2>
          Order Summary
        </h2>

        <div className="summary-row">

          <span>

            Subtotal (
            {cart.length}
            {" "}
            items)

          </span>

          <span>

            ₹
            {" "}
            {subtotal.toFixed(2)}

          </span>

        </div>

        <div className="summary-row">

          <span>
            Shipping
          </span>

          <span>

            ₹
            {" "}
            {shipping.toFixed(2)}

          </span>

        </div>

        <div className="summary-row">

          <span>
            Tax (5%)
          </span>

          <span>

            ₹
            {" "}
            {tax.toFixed(2)}

          </span>

        </div>

        {/* DISCOUNT */}

        <div className="summary-row">

          <span>
            Discount
          </span>

          <span>

            - ₹
            {" "}
            {discount.toFixed(2)}

          </span>

        </div>

        <hr />

        <div className="summary-total">

          <span>
            Total
          </span>

          <span>

            ₹
            {" "}
            {total.toFixed(2)}

          </span>

        </div>

        <ul>

          <li>
            Free shipping on orders over ₹50
          </li>

          <li>
            30-day return policy
          </li>

          <li>
            Secure checkout with SSL encryption
          </li>

        </ul>

      </div>

    </div>
  );
}

export default Checkout;