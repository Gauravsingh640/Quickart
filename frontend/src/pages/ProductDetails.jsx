import {
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
  useContext,
} from "react";

import axios from "axios";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  toast,
} from "react-toastify";

import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function ProductDetails() {

  const { id } =
  useParams();

  const {

    cart,

    addToCart,

    increaseQty,

    decreaseQty,

  } = useContext(
    AuthContext
  );

  const [product,
    setProduct] =
    useState(null);

  const [mainImage,
    setMainImage] =
    useState("");

  const [currentIndex,
    setCurrentIndex] =
    useState(0);

  // FETCH PRODUCT

  const fetchProduct =
  async () => {

    try {

      const res =
      await axios.get(

        `https://quickart-jxc5.onrender.com/api/v1/products/${id}`
      );

      setProduct(
        res.data.product
      );

      setMainImage(

        res.data.product
        ?.images?.[0]?.url
      );

    }

    catch(error){

      console.log(error);
    }
  };

  useEffect(() => {

    fetchProduct();

  }, []);

  // LOADING

  if (!product){

    return <h1>Loading...</h1>;
  }

  // CART ITEM

  const cartItem =
  cart.find(

    (item) =>

      item._id ===
      product._id
  );

  const quantity =
  cartItem
  ?
  cartItem.quantity
  :
  0;

  // ADD TO CART

  const handleAddToCart =
  () => {

    addToCart({

      ...product,

      quantity:1,
    });

    toast.success(
      "Added To Cart"
    );
  };

  // NEXT IMAGE

  const nextImage =
  () => {

    const newIndex =

      currentIndex ===
      product.images.length - 1

      ?

      0

      :

      currentIndex + 1;

    setCurrentIndex(
      newIndex
    );

    setMainImage(

      product.images[
        newIndex
      ].url
    );
  };

  // PREVIOUS IMAGE

  const prevImage =
  () => {

    const newIndex =

      currentIndex === 0

      ?

      product.images.length - 1

      :

      currentIndex - 1;

    setCurrentIndex(
      newIndex
    );

    setMainImage(

      product.images[
        newIndex
      ].url
    );
  };

  return (

    <div className="details-page">

      {/* LEFT */}

      <div className="details-left">

        {/* SMALL IMAGES */}

        <div className="small-images">

          {

            product.images.map(

              (img, index) => (

                <img

                  key={index}

                  src={img.url}

                  alt=""

                  onClick={() => {

                    setMainImage(
                      img.url
                    );

                    setCurrentIndex(
                      index
                    );
                  }}
                />
              ))
          }

        </div>

        {/* MAIN IMAGE */}

        <div className="main-image">

          {/* LEFT ARROW */}

          {

            product.images.length > 1

            &&

            <button

              className="img-arrow left-arrow"

              onClick={
                prevImage
              }
            >

              <FaChevronLeft />

            </button>
          }

          {/* IMAGE */}

          <img

            src={mainImage}

            alt=""
          />

          {/* RIGHT ARROW */}

          {

            product.images.length > 1

            &&

            <button

              className="img-arrow right-arrow"

              onClick={
                nextImage
              }
            >

              <FaChevronRight />

            </button>
          }

        </div>

      </div>

      {/* RIGHT */}

      <div className="details-right">

        <h1>

          {product.name}

        </h1>

        <p className="brand">

          {product.category}

          {" | "}

          {product.brand}

        </p>

        <h2>

          ₹
          {product.price}

        </h2>

        <p className="desc">

          {product.description}

        </p>

        {

          quantity === 0

          ?

          (

            <button
              onClick={
                handleAddToCart
              }
            >

              Add To Cart

            </button>

          )

          :

          (

            <div className="qty-box1">

              <button

                onClick={() =>

                  decreaseQty(
                    product._id
                  )
                }
              >

                -

              </button>

              <span>

                {quantity}

              </span>

              <button

                onClick={() =>

                  increaseQty(
                    product._id
                  )
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