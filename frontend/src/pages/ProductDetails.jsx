import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useContext,
} from "react";

import products
from "../data/products";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  toast,
} from "react-toastify";

function ProductDetails() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
  } = useContext(AuthContext);

  const product =
    products.find(
      (item) =>
        item.id === Number(id)
    );

  const [mainImage, setMainImage] =
    useState(
      product.images[0]
    );

  // FIND PRODUCT IN CART

  const cartItem =
    cart.find(
      (item) =>
        item.id === product.id
    );

  const quantity =
    cartItem
      ? cartItem.quantity
      : 0;

  // ADD TO CART

  const handleAddToCart = () => {

    addToCart(product);

    toast.success(
      "Added To Cart"
    );
  };

  return (

    <div className="details-page">

      {/* LEFT */}

      <div className="details-left">

        <div className="small-images">

          {
            product.images.map(
              (img, index) => (

                <img
                  key={index}
                  src={img}
                  alt=""
                  onClick={() =>
                    setMainImage(img)
                  }
                />
              )
            )
          }

        </div>

        <div className="main-image">

          <img
            src={mainImage}
            alt=""
          />

        </div>

      </div>

      {/* RIGHT */}

      <div className="details-right">

        <h1>
          {product.title}
        </h1>

        <p className="brand">

          {product.category}

          {" | "}

          {product.brand}

        </p>

        <h2>
          ₹ {product.price}
        </h2>

        <p className="desc">
          {product.description}
        </p>

        {
          quantity === 0 ? (

            <button
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>

          ) : (

            <div className="qty-box1">

              <button
                onClick={() =>
                  decreaseQty(product.id)
                }
              >
                -
              </button>

              <span>
                {quantity}
              </span>

              <button
                onClick={() =>
                  increaseQty(product.id)
                }
              >
                +
              </button>

            </div>

          )
        }

      </div>

    </div>
  );
}

export default ProductDetails;