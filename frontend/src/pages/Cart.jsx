import { useContext } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { FaTrash } from "react-icons/fa";

import { toast } from "react-toastify";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,

    increaseQty,
    decreaseQty,

    setCart,

    discount,
    setDiscount,

    promoCode,
    setPromoCode,
  } = useContext(AuthContext);

  // EMPTY CART

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-box">
          <h1>Your Cart is Empty</h1>

          <button onClick={() => navigate("/products")}>Start Shopping</button>
        </div>
      </div>
    );
  }

  // REMOVE ITEM

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);

    toast.success("Item Removed");
  };

  // TOTALS

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,

    0,
  );

  const shipping = 90;

  const tax = subtotal * 0.05;

  // FINAL TOTAL

  const total = Math.max(
    subtotal + shipping + tax - discount,

    0,
  );

  // APPLY PROMO

  const applyPromo = () => {
    // EMPTY

    if (promoCode.trim() === "") {
      toast.error("Enter Promo Code");

      return;
    }

    // VALID

    if (promoCode === "QUICK20") {
      const discountAmount = subtotal * 0.2;

      setDiscount(discountAmount);

      toast.success("Promo Applied");
    }

    // INVALID
    else {
      setDiscount(0);

      toast.error("Invalid Promo Code");
    }
  };

  // CHECKOUT

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      {/* LEFT */}

      <div className="cart-left-section">
        <h1>Shopping Cart</h1>

        {cart.map((item) => (
          <div key={item.id} className="cart-card">
            {/* PRODUCT */}

            <div className="cart-product">
              <img src={item.image} alt="" />

              <div>
                <h3>{item.title}</h3>

                <p>₹ {item.price}</p>
              </div>
            </div>

            {/* QUANTITY */}

            <div className="qty-section">
              <button onClick={() => decreaseQty(item.id)}>-</button>

              <span>{item.quantity}</span>

              <button onClick={() => increaseQty(item.id)}>+</button>
            </div>

            {/* ITEM TOTAL */}

            <h3>₹{(item.price * item.quantity).toFixed(2)}</h3>

            {/* REMOVE */}

            <button className="remove-btn" onClick={() => removeItem(item.id)}>
              <FaTrash />
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT */}

      <div className="summary-box">
        <h2>Order Summary</h2>

        {/* SUBTOTAL */}

        <div className="summary-row">
          <span>Subtotal</span>

          <span>₹ {subtotal.toFixed(2)}</span>
        </div>

        {/* SHIPPING */}

        <div className="summary-row">
          <span>Shipping</span>

          <span>₹ {shipping.toFixed(2)}</span>
        </div>

        {/* TAX */}

        <div className="summary-row">
          <span>Tax (5%)</span>

          <span>₹ {tax.toFixed(2)}</span>
        </div>

        {/* DISCOUNT */}

        <div className="summary-row">
          <span>Discount</span>

          <span>- ₹ {discount.toFixed(2)}</span>
        </div>

        <hr />

        {/* TOTAL */}

        <div className="summary-total">
          <span>Total</span>

          <span>₹ {total.toFixed(2)}</span>
        </div>

        {/* PROMO */}

        <div className="promo-box">
          <input
            type="text"
            placeholder="Promo code e.g. QUICK20"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />

          <button onClick={applyPromo}>Apply</button>
        </div>

        {/* CHECKOUT */}

        <button className="order-btn" onClick={handleCheckout}>
          PLACE ORDER
        </button>

        {/* CONTINUE */}

        <button className="continue-btn" onClick={() => navigate("/products")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Cart;
