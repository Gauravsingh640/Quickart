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
    user,
    addToCart,
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

  // ADD TO CART

  const handleAddToCart = () => {

    // LOGIN CHECK

    if (!user) {

      toast.error(
        "Please Login First"
      );

      navigate("/login");

      return;
    }

    // ADD PRODUCT

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
          {
            product.description
          }
        </p>

        <button
          onClick={
            handleAddToCart
          }
        >
          Add To Cart
        </button>

      </div>

    </div>
  );
}

export default ProductDetails;