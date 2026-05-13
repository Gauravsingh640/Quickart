import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function ProductCard({ item }) {

  const navigate = useNavigate();

  const {
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
  } = useContext(AuthContext);

  // CURRENT PRODUCT QUANTITY

  const cartItem = cart.find(
    (product) => product.id === item.id
  );

  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {

    e.stopPropagation();

    addToCart(item);

    toast.success("Added To Cart");
  };

  return (
    <div
      className="card"
      onClick={() =>
        navigate(`/product/${item.id}`)
      }
    >

      <img src={item.image} alt="" />

      <h3>{item.title}</h3>

      <p>{item.brand}</p>

      <h2>₹ {item.price}</h2>

      {
        quantity === 0 ? (

          <button onClick={handleAddToCart}>
            Add To Cart
          </button>

        ) : (

          <div
            className="qty-box"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={(e) => {
                e.stopPropagation();
                decreaseQty(item.id);
              }}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                increaseQty(item.id);
              }}
            >
              +
            </button>

          </div>

        )
      }

    </div>
  );
}

export default ProductCard;