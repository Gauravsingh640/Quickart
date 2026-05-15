// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { toast } from "react-toastify";

// function ProductCard({ item }) {

//   const navigate = useNavigate();

//   const {
//     cart,
//     addToCart,
//     increaseQty,
//     decreaseQty,
//   } = useContext(AuthContext);

//   // CURRENT PRODUCT QUANTITY

//   const cartItem = cart.find(
//     (product) => product.id === item.id
//   );

//   const quantity = cartItem ? cartItem.quantity : 0;

//   const handleAddToCart = (e) => {

//     e.stopPropagation();

//     addToCart(item);

//     toast.success("Added To Cart");
//   };

//   return (
//     <div
//       className="card"
//       onClick={() =>
//         navigate(`/product/${item.id}`)
//       }
//     >

//       <img src={item.image} alt="" />

//       <h3>{item.title}</h3>

//       <p>{item.brand}</p>

//       <h2>₹ {item.price}</h2>

//       {
//         quantity === 0 ? (

//           <button onClick={handleAddToCart}>
//             Add To Cart
//           </button>

//         ) : (

//           <div
//             className="qty-box"
//             onClick={(e) => e.stopPropagation()}
//           >

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 decreaseQty(item.id);
//               }}
//             >
//               -
//             </button>

//             <span>{quantity}</span>

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 increaseQty(item.id);
//               }}
//             >
//               +
//             </button>

//           </div>

//         )
//       }

//     </div>
//   );
// }

// export default ProductCard;

import {
  useContext,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  toast,
} from "react-toastify";

function ProductCard({
  item,
}) {

  const navigate =
  useNavigate();

  const {

    cart,

    addToCart,

    increaseQty,

    decreaseQty,

  } = useContext(
    AuthContext
  );

  // FIND PRODUCT

  const cartItem =
  cart.find(

    (product) =>

      product._id ===
      item._id
  );

  const quantity =
  cartItem
  ?
  cartItem.quantity
  :
  0;

  // ADD

  const handleAddToCart =
  (e) => {

    e.stopPropagation();

    addToCart({

      ...item,

      quantity:1,
    });

    toast.success(
      "Added To Cart"
    );
  };

  return (

    <div

      className="card"

      onClick={() =>

        navigate(

          `/product/${item._id}`
        )
      }
    >

      {/* IMAGE */}

      <img

        src={
          item.images?.[0]?.url
        }

        alt=""
      />

      {/* NAME */}

      <h3>

        {item.name}

      </h3>

      {/* BRAND */}

      <p>

        {item.brand}

      </p>

      {/* PRICE */}

      <h2>

        ₹
        {item.price}

      </h2>

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

          <div

            className="qty-box"

            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button

              onClick={(e) => {

                e.stopPropagation();

                decreaseQty(
                  item._id
                );
              }}
            >

              -

            </button>

            <span>

              {quantity}

            </span>

            <button

              onClick={(e) => {

                e.stopPropagation();

                increaseQty(
                  item._id
                );
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