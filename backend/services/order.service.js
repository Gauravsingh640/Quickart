import { Order } from "../models/order.model.js";

/**
 * Get all orders of a user
 */
export const getUserOrders = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * Get latest order
 */
export const getLatestOrder = async (userId) => {
  return await Order.findOne({ user: userId }).sort({ createdAt: -1 });
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId) => {
  return await Order.findById(orderId);
};

/**
 * Track latest order
 */
export const trackOrder = async (userId) => {
  const order = await Order.findOne({ user: userId }).sort({
    createdAt: -1,
  });

  if (!order) {
    return null;
  }

  return {
    orderId: order._id,
    status: order.status,
    deliveryCode: order.deliveryCode,
    totalPrice: order.totalPrice,
    items: order.items,
    address: order.address,
    orderedAt: order.createdAt,
  };
};

/**
 * Cancel Order
 */
export const cancelOrder = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (
    order.status === "Delivered" ||
    order.status === "Cancelled"
  ) {
    throw new Error(
      `Order cannot be cancelled. Current status: ${order.status}`
    );
  }

  order.status = "Cancelled";

  await order.save();

  return order;
};