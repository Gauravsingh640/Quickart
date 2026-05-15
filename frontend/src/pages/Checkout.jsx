// Checkout.jsx

import {
  useContext,
  useState,
  useEffect,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  toast,
} from "react-toastify";

function Checkout() {

  const navigate =
    useNavigate();

  // ADDRESS FORM

  const [showForm, setShowForm] =
    useState(false);

  // SELECTED ADDRESS

  const [selectedAddress, setSelectedAddress] =
    useState(0);

  const {
    cart,
    setCart,
    user,
    discount,
  } = useContext(AuthContext);

  // ADDRESSES

  const [addresses, setAddresses] =
    useState([]);

  // LOAD ADDRESSES

  useEffect(() => {

    // LOGGED USER
    if (user) {

      const userAddresses =
        JSON.parse(
          localStorage.getItem(
            "userAddresses"
          )
        ) || [];

      const guestAddresses =
        JSON.parse(
          sessionStorage.getItem(
            "guestAddresses"
          )
        ) || [];

      // PROFILE ADDRESS

      let profileAddress = [];

      if (user.address) {

        profileAddress = [

          {
            fullName:
              `${user.firstName || ""} ${user.lastName || ""}`,

            phone:
              user.phoneNo || "",

            email:
              user.email || "",

            address:
              user.address || "",

            city:
              user.city || "",

            state:
              user.state || "",

            zipCode:
              user.zipCode || "",

            country:
              "India",

            isProfileAddress: true,
          }
        ];
      }

      // MERGE

      const mergedAddresses = [

        ...profileAddress,

        ...userAddresses,

        ...guestAddresses,
      ];

      setAddresses(
        mergedAddresses
      );

      localStorage.setItem(

        "userAddresses",

        JSON.stringify(
          mergedAddresses.filter(
            (item) =>
              !item.isProfileAddress
          )
        )
      );

      sessionStorage.removeItem(
        "guestAddresses"
      );

    } else {

      // GUEST

      const guestAddresses =
        JSON.parse(
          sessionStorage.getItem(
            "guestAddresses"
          )
        ) || [];

      setAddresses(
        guestAddresses
      );
    }

  }, [user]);

  // SAVE ADDRESSES

  useEffect(() => {

    const filteredAddresses =
      addresses.filter(
        (item) =>
          !item.isProfileAddress
      );

    if (user) {

      localStorage.setItem(
        "userAddresses",
        JSON.stringify(
          filteredAddresses
        )
      );

    } else {

      sessionStorage.setItem(
        "guestAddresses",
        JSON.stringify(
          filteredAddresses
        )
      );
    }

  }, [addresses, user]);

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

    toast.success(
      "Address Added"
    );
  };

  // DELETE ADDRESS

  const deleteAddress = (index) => {

    if (
      addresses[index]
        .isProfileAddress
    ) {

      toast.error(
        "Default Address Can't Be Deleted"
      );

      return;
    }

    const updated =
      addresses.filter(
        (_, i) => i !== index
      );

    setAddresses(updated);

    toast.success(
      "Address Deleted"
    );
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

  const shipping = 90;

  const tax =
    subtotal * 0.18;

  const total =

    subtotal +
    shipping +
    tax -
    discount;

  // PAYMENT

  const handlePayment = () => {

    if (
      cart.length === 0
    ) {

      toast.error(
        "Cart is Empty"
      );

      return;
    }

    if (!user) {

      toast.error(
        "Please Login First"
      );

      navigate("/login");

      return;
    }

    if (
      addresses.length === 0
    ) {

      toast.error(
        "Please Add Address"
      );

      return;
    }

    const options = {

      key:
        "rzp_test_SbA8xxgskiDGuP",

      amount:
        Math.round(
          total * 100
        ),

      currency:
        "INR",

      name:
        "KART",

      description:
        "Order Payment",

      image:
        "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
      modal:{

        ondismiss: async function () {

          try {

            const token =
            sessionStorage.getItem(
              "token"
            );

            await axios.post(

              "https://quickart-jxc5.onrender.com/api/v1/order/create",

              {

                items: cart,

                totalPrice: total,

                address:
                addresses[
                  selectedAddress
                ],

                status:"Failed",
              },

              {

                headers:{

                  Authorization:
                  `Bearer ${token}`,
                },
              }
            );

            toast.error(
              "Payment Failed"
            );

          }

          catch(error){

            console.log(error);
          }
        },
      },

      handler:
        async function () {

          toast.success(
            "Payment Successful"
          );

          try {

            const token =
              sessionStorage.getItem(
                "token"
              );

            await axios.post(

              "https://quickart-jxc5.onrender.com/api/v1/order/create",  
              {
                items: cart,

                totalPrice:
                  total,

                address: 
                    selectedAddress ,

                 status:"Paid",
              },

              {
                headers: {

                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

            setCart([]);

            localStorage.removeItem(
              "userCart"
            );

            navigate(
              "/success"
            );

          } catch (error) {

            console.log(
              error
            );
          }
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
        color:
          "#e60073",
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

        <h2>
          Saved Addresses
        </h2>

        {
          !user &&
          addresses.length === 0 && (

            <div className="guest-warning">

              <p>
                Add Delivery
                Address
              </p>

            </div>
          )
        }

        {
          user &&
          addresses.length === 0 ? (

            <div className="no-address">

              <p>
                No Address Found
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/profile/userDetails"
                  )
                }
              >
                Add Details
              </button>

            </div>

          ) : (

            addresses.map(
              (
                item,
                index
              ) => (

                <div

                  className={`address-card ${
                    selectedAddress === index
                      ? "active-address"
                      : ""
                  }`}

                  key={index}

                  onClick={() =>
                    setSelectedAddress(index)
                  }
                >

                  <div className="address-top">

                    <div className="address-left">

                      <input

                        type="radio"

                        checked={
                          selectedAddress === index
                        }

                        onChange={() =>
                          setSelectedAddress(index)
                        }
                      />

                      <h3>
                        {item.fullName}
                      </h3>

                    </div>

                    <div>

                      {
                        !item.isProfileAddress && (

                          <div

                            className="delete-btn"

                            onClick={(e) => {

                              e.stopPropagation();

                              deleteAddress(index);
                            }}
                          >
                            Delete
                          </div>
                        )
                      }

                    </div>

                  </div>

                  <p className="address-text">

                    {item.phone}
                    {" | "}
                    {item.email}

                    <br />

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

                  {
                    item.isProfileAddress && (

                      <span className="default-badge">
                        Default Address
                      </span>
                    )
                  }

                </div>
              )
            )
          )
        }

        {/* ADD ADDRESS BUTTON */}

        <button

          className="add-address-btn"

          onClick={() =>
            setShowForm(
              !showForm
            )
          }
        >
          + Add Another Address
        </button>

        {/* FORM */}

        {
          showForm && (

            <form

              className="address-form"

              onSubmit={
                saveAddress
              }
            >

              <input

                type="text"

                name="fullName"

                placeholder="Full Name"

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

                placeholder="Phone Number"

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

                placeholder="Address"

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

                  placeholder="Zip Code"

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

                  placeholder="Country"

                  value={
                    formData.country
                  }

                  onChange={
                    handleChange
                  }

                  required
                />

              </div>

              <button type="submit">
                Save Address
              </button>

            </form>
          )
        }

        {/* PAYMENT */}

        <button

          className="checkout-btn"

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
            Tax (18%)
          </span>

          <span>
            ₹
            {" "}
            {tax.toFixed(2)}
          </span>

        </div>

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

      </div>

    </div>
  );
}

export default Checkout;