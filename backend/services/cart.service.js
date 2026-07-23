import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

/**
 * Add product to user's cart
 */
export const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  return cart;
};

/**
 * Remove product from cart
 */
export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await cart.save();

  return cart;
};

/**
 * Get user's cart
 */
export const getCart = async (userId) => {
  return await Cart.findOne({ userId }).populate("items.product");
};

/**
 * Clear cart
 */
export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  cart.items = [];

  await cart.save();

  return cart;
};