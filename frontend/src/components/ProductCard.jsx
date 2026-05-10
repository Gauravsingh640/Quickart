import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
function ProductCard({ item }) {
  const navigate = useNavigate();
  const { user, addToCart } = useContext(AuthContext);
  const handleAddToCart = (e) => {
    // USER NOT LOGIN

    if (!user) {
      toast.success("Please Login First");

      navigate("/login");

      return;
    }

    // ADD TO CART
    e.stopPropagation();
    addToCart(item);
    toast.success(
      "Added To Cart"
    );
  };

  return (
    <div
      className="card"
      onClick={() =>
        navigate(
          `/product/${item.id}`
        )
      }
    >
      <img src={item.image} alt="" />

      <h3>{item.title}</h3>

      <p>{item.brand}</p>

      <h2>₹ {item.price}</h2>

      <button onClick={handleAddToCart}>Add To Cart</button>
    </div>
  );
}

export default ProductCard;
