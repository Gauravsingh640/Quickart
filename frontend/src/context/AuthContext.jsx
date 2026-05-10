import {
  createContext,
  useState,
} from "react";

export const AuthContext =
  createContext();

function AuthProvider({
  children,
}) {

  // USER

  const storedUser =
    localStorage.getItem(
        "user"
    );

    const [user, setUser] =
    useState(

        storedUser &&
        storedUser !== "undefined"

        ? JSON.parse(
            storedUser
            )

        : null
    );

  // CART

  const [cart, setCart] =
    useState([]);

  // PROMO

  const [discount, setDiscount] =
    useState(0);

  const [promoCode, setPromoCode] =
    useState("");


  const [orders, setOrders] =
  useState([]);
  // ADD TO CART

  const addToCart = (
    product
  ) => {

    const itemExists =
      cart.find(
        (item) =>
          item.id ===
          product.id
      );

    if (itemExists) {

      const updatedCart =
        cart.map((item) =>

          item.id ===
          product.id

            ? {
                ...item,

                quantity:
                  item.quantity +
                  1,
              }

            : item
        );

      setCart(updatedCart);

    }
    else {

      setCart([
        ...cart,

        {
          ...product,

          quantity: 1,
        },
      ]);
    }
  };

  // INCREASE QTY

  const increaseQty = (
    id
  ) => {

    const updatedCart =
      cart.map((item) =>

        item.id === id

          ? {
              ...item,

              quantity:
                item.quantity +
                1,
            }

          : item
      );

    setCart(updatedCart);
  };

  // DECREASE QTY

  const decreaseQty = (
    id
  ) => {

    const updatedCart =
      cart

        .map((item) =>

          item.id === id

            ? {
                ...item,

                quantity:
                  item.quantity -
                  1,
              }

            : item
        )

        .filter(
          (item) =>
            item.quantity > 0
        );

    setCart(updatedCart);
  };

  return (

    <AuthContext.Provider

      value={{

        // USER

        user,
        setUser,

        // CART

        cart,
        setCart,

        addToCart,

        increaseQty,
        decreaseQty,

        // PROMO

        discount,
        setDiscount,

        promoCode,
        setPromoCode,

        orders,
        setOrders,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export default AuthProvider;