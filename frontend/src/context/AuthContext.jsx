import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  // USER

  const storedUser = sessionStorage.getItem("user");

  const [user, setUser] = useState(
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,
  );

  const mergeCarts = (guestCart, userCart) => {

    const merged = [...userCart];

    guestCart.forEach((guestItem) => {

      const existingItem = merged.find(
        (item) => item.id === guestItem.id
      );

      if (existingItem) {

        existingItem.quantity += guestItem.quantity;

      } else {

        merged.push(guestItem);
      }
    });

    return merged;
  };

  useEffect(() => {

    if (user) {

      const savedUserCart =
        JSON.parse(
          localStorage.getItem("userCart")
        ) || [];

      const guestCart =
        JSON.parse(
          sessionStorage.getItem("guestCart")
        ) || [];
 
      // MERGE BOTH CARTS
      const mergedCart =
        mergeCarts(
          guestCart,
          savedUserCart
        );

      setCart(mergedCart);

      // SAVE MERGED CART
      localStorage.setItem(
        "userCart",
        JSON.stringify(mergedCart)
      );

      // CLEAR GUEST CART
      sessionStorage.removeItem("guestCart");

    } else {

      const guestCart =
        JSON.parse(
          sessionStorage.getItem("guestCart")
        ) || [];

      setCart(guestCart);
    }

  }, [user]);
  // CART

  const [cart, setCart] = useState(() => {

    if (storedUser) {

      return JSON.parse(
        localStorage.getItem("userCart")
      ) || [];
    }

    return JSON.parse(
      sessionStorage.getItem("guestCart")
    ) || [];
  });

  // SAVE CART

  useEffect(() => {

    if (user) {

      // SAVE USER CART
      localStorage.setItem(
        "userCart",
        JSON.stringify(cart)
      );

    } else {

      // SAVE GUEST CART
      sessionStorage.setItem(
        "guestCart",
        JSON.stringify(cart)
      );
    }

  }, [cart, user]);
  // PROMO

  const [discount, setDiscount] = useState(0);

  const [promoCode, setPromoCode] = useState("");

  const [orders, setOrders] = useState([]);
  // ADD TO CART

  const addToCart = (product) => {
    const itemExists = cart.find((item) => item.id === product.id);

    if (itemExists) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,

              quantity: item.quantity + 1,
            }
          : item,
      );

      setCart(updatedCart);
    } else {
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

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,

            quantity: item.quantity + 1,
          }
        : item,
    );

    setCart(updatedCart);
  };

  // DECREASE QTY

  const decreaseQty = (id) => {
    const updatedCart = cart

      .map((item) =>
        item.id === id
          ? {
              ...item,

              quantity: item.quantity - 1,
            }
          : item,
      )

      .filter((item) => item.quantity > 0);

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
