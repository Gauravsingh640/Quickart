// services/analytics.service.js

import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

// ==========================================
// CONSTANTS
// ==========================================

const LOW_STOCK_THRESHOLD = 9;

const ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out For Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// ==========================================
// BUSINESS OVERVIEW
// ==========================================

export const getOverviewAnalytics = async () => {
  try {
    const [
      totalOrders,

      deliveredAnalytics,

      pendingOrders,
      confirmedOrders,
      packedOrders,
      shippedOrders,
      outForDeliveryOrders,
      cancelledOrders,

      totalProducts,
      totalUsers,
    ] = await Promise.all([
      // --------------------------------------
      // TOTAL ORDERS
      // --------------------------------------

      Order.countDocuments(),

      // --------------------------------------
      // DELIVERED REVENUE + COUNT
      // --------------------------------------

      Order.aggregate([
        {
          $match: {
            status: ORDER_STATUS.DELIVERED,
          },
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: "$totalPrice",
            },

            deliveredOrders: {
              $sum: 1,
            },
          },
        },
      ]),

      // --------------------------------------
      // ORDER STATUS COUNTS
      // --------------------------------------

      Order.countDocuments({
        status: ORDER_STATUS.PENDING,
      }),

      Order.countDocuments({
        status: ORDER_STATUS.CONFIRMED,
      }),

      Order.countDocuments({
        status: ORDER_STATUS.PACKED,
      }),

      Order.countDocuments({
        status: ORDER_STATUS.SHIPPED,
      }),

      Order.countDocuments({
        status: ORDER_STATUS.OUT_FOR_DELIVERY,
      }),

      Order.countDocuments({
        status: ORDER_STATUS.CANCELLED,
      }),

      // --------------------------------------
      // PRODUCTS
      // --------------------------------------

      Product.countDocuments(),

      // --------------------------------------
      // VERIFIED USERS
      // --------------------------------------

      User.countDocuments({
        isVerified: true,
      }),
    ]);

    // ========================================
    // DELIVERED ANALYTICS
    // ========================================

    const deliveredData = deliveredAnalytics[0] || {
      totalRevenue: 0,
      deliveredOrders: 0,
    };

    // ========================================
    // RETURN
    // ========================================

    return {
      totalRevenue: Number(Number(deliveredData.totalRevenue || 0).toFixed(2)),

      totalOrders,

      deliveredOrders: deliveredData.deliveredOrders || 0,

      pendingOrders,

      confirmedOrders,

      packedOrders,

      shippedOrders,

      outForDeliveryOrders,

      cancelledOrders,

      totalProducts,

      totalUsers,
    };
  } catch (error) {
    console.error("Overview Analytics Error:", error);

    throw error;
  }
};

// ==========================================
// TOP SELLING PRODUCTS
// ==========================================

export const getTopSellingProducts = async () => {
  try {
    const topProducts = await Order.aggregate([
      // --------------------------------------
      // ONLY DELIVERED ORDERS
      // --------------------------------------

      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
        },
      },

      // --------------------------------------
      // EXPAND ORDER ITEMS
      // --------------------------------------

      {
        $unwind: "$items",
      },

      // --------------------------------------
      // GROUP BY PRODUCT
      // --------------------------------------

      {
        $group: {
          _id: "$items.id",

          name: {
            $first: "$items.title",
          },

          image: {
            $first: "$items.image",
          },

          totalSold: {
            $sum: "$items.quantity",
          },

          revenue: {
            $sum: {
              $multiply: ["$items.price", "$items.quantity"],
            },
          },
        },
      },

      // --------------------------------------
      // RANK BY UNITS SOLD
      // --------------------------------------

      {
        $sort: {
          totalSold: -1,
          revenue: -1,
          _id: 1,
        },
      },

      // --------------------------------------
      // TOP 5
      // --------------------------------------

      {
        $limit: 5,
      },

      // --------------------------------------
      // CLEAN OUTPUT
      // --------------------------------------

      {
        $project: {
          _id: 0,

          productId: "$_id",

          name: 1,

          image: 1,

          totalSold: 1,

          revenue: {
            $round: ["$revenue", 2],
          },
        },
      },
    ]);

    return topProducts;
  } catch (error) {
    console.error("Top Products Analytics Error:", error);

    throw error;
  }
};

// ==========================================
// LEAST SELLING PRODUCTS
// ==========================================

export const getLeastSellingProducts = async () => {
  try {
    const leastProducts = await Order.aggregate([
      // --------------------------------------
      // ONLY DELIVERED ORDERS
      // --------------------------------------

      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
        },
      },

      // --------------------------------------
      // EXPAND ORDER ITEMS
      // --------------------------------------

      {
        $unwind: "$items",
      },

      // --------------------------------------
      // GROUP BY PRODUCT
      // --------------------------------------

      {
        $group: {
          _id: "$items.id",

          name: {
            $first: "$items.title",
          },

          image: {
            $first: "$items.image",
          },

          totalSold: {
            $sum: "$items.quantity",
          },

          revenue: {
            $sum: {
              $multiply: ["$items.price", "$items.quantity"],
            },
          },
        },
      },

      // --------------------------------------
      // LEAST SOLD FIRST
      // --------------------------------------

      {
        $sort: {
          totalSold: 1,
          revenue: 1,
          _id: 1,
        },
      },

      // --------------------------------------
      // BOTTOM 5
      // --------------------------------------

      {
        $limit: 5,
      },

      // --------------------------------------
      // CLEAN OUTPUT
      // --------------------------------------

      {
        $project: {
          _id: 0,

          productId: "$_id",

          name: 1,

          image: 1,

          totalSold: 1,

          revenue: {
            $round: ["$revenue", 2],
          },
        },
      },
    ]);

    return leastProducts;
  } catch (error) {
    console.error("Least Products Analytics Error:", error);

    throw error;
  }
};

// ==========================================
// LOW STOCK PRODUCTS
// ==========================================

export const getLowStockProducts = async () => {
  try {
    // ========================================
    // RUN QUERIES IN PARALLEL
    // ========================================

    const [lowStockProducts, leastStockProducts, totalProducts] =
      await Promise.all([
        // --------------------------------------
        // PRODUCTS REQUIRING RESTOCK
        // stock <= threshold
        // --------------------------------------

        Product.find({
          stock: {
            $lte: LOW_STOCK_THRESHOLD,
          },
        })
          .select("_id name brand category stock price images")
          .sort({
            stock: 1,
            name: 1,
          })
          .lean(),

        // --------------------------------------
        // 5 PRODUCTS WITH LEAST STOCK
        // --------------------------------------

        Product.find({})
          .select("_idname brand category stock price images")
          .sort({
            stock: 1,
            name: 1,
          })
          .limit(5)
          .lean(),

        // --------------------------------------
        // TOTAL PRODUCTS
        // --------------------------------------

        Product.countDocuments(),
      ]);

    // ========================================
    // RETURN
    // ========================================

    return {
      threshold: LOW_STOCK_THRESHOLD,

      lowStockProducts,

      leastStockProducts,

      lowStockCount: lowStockProducts.length,

      totalProducts,
    };
  } catch (error) {
    console.error("Low Stock Analytics Error:", error);

    throw error;
  }
};

// ==========================================
// WEEKLY SALES
// ==========================================

export const getWeeklySales = async () => {
  try {
    const end = new Date();

    const start = new Date();

    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const analytics = await Order.aggregate([
      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalPrice",
          },
          orders: {
            $sum: 1,
          },
        },
      },
    ]);

    const data = analytics[0] || {
      revenue: 0,
      orders: 0,
    };

    return {
      revenue: Number(Number(data.revenue).toFixed(2)),
      orders: data.orders,
};
  } catch (error) {
    console.error("Weekly Sales Error:", error);
    throw error;
  }
};

// ==========================================
// TODAY SALES
// ==========================================

export const getTodaySales = async () => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const analytics = await Order.aggregate([
      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
          createdAt: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$totalPrice",
          },
          orders: {
            $sum: 1,
          },
        },
      },
    ]);

    const data = analytics[0] || {
      revenue: 0,
      orders: 0,
    };

    return {
      revenue: Number(Number(data.revenue).toFixed(2)),
      orders: data.orders,
    };
  } catch (error) {
    console.error("Today Sales Error:", error);
    throw error;
  }
};

// ==========================================
// MONTHLY SALES
// ==========================================

export const getMonthlySales = async () => {
  try {
    const monthlySales = await Order.aggregate([
      // --------------------------------------
      // DELIVERED ORDERS ONLY
      // --------------------------------------

      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
        },
      },

      // --------------------------------------
      // GROUP BY YEAR + MONTH
      // --------------------------------------

      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },

            month: {
              $month: "$createdAt",
            },
          },

          revenue: {
            $sum: "$totalPrice",
          },

          orders: {
            $sum: 1,
          },
        },
      },

      // --------------------------------------
      // CHRONOLOGICAL ORDER
      // --------------------------------------

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },

      // --------------------------------------
      // CLEAN OUTPUT
      // --------------------------------------

      {
        $project: {
          _id: 0,

          year: "$_id.year",

          monthNumber: "$_id.month",

          month: {
            $arrayElemAt: [
              [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],

              "$_id.month",
            ],
          },

          revenue: {
            $round: ["$revenue", 2],
          },

          orders: 1,
        },
      },
    ]);

    return monthlySales;
  } catch (error) {
    console.error("Monthly Sales Analytics Error:", error);

    throw error;
  }
};

// ==========================================
// CATEGORY SALES
// ==========================================

export const getCategorySales = async () => {
  try {
    const categorySales = await Order.aggregate([
      // --------------------------------------
      // DELIVERED ORDERS ONLY
      // --------------------------------------

      {
        $match: {
          status: ORDER_STATUS.DELIVERED,
        },
      },

      // --------------------------------------
      // EXPAND ITEMS
      // --------------------------------------

      {
        $unwind: "$items",
      },

      // --------------------------------------
      // GET PRODUCT CATEGORY
      // --------------------------------------

      

      // --------------------------------------
      // GROUP BY CATEGORY
      // --------------------------------------

      {
        $group: {
          _id: "$items.category",

          sold: {
            $sum: "$items.quantity",
          },

          revenue: {
            $sum: {
              $multiply: ["$items.price", "$items.quantity"],
            },
          },
        },
      },

      // --------------------------------------
      // HIGHEST REVENUE FIRST
      // --------------------------------------

      {
        $sort: {
          revenue: -1,
          sold: -1,
          _id: 1,
        },
      },

      // --------------------------------------
      // CLEAN OUTPUT
      // --------------------------------------

      {
        $project: {
          _id: 0,

          category: "$_id",

          sold: 1,

          revenue: {
            $round: ["$revenue", 2],
          },
        },
      },
    ]);
    console.log("Category Sales Analytics:",JSON.stringify(categorySales, null, 2));

    return categorySales;
  } catch (error) {
    console.error("Category Sales Analytics Error:", error);

    throw error;
  }
};

// ==========================================
// ORDER ANALYTICS
// ==========================================

export const getOrderAnalytics = async () => {
  try {
    const statusData = await Order.aggregate([
      // --------------------------------------
      // GROUP BY STATUS
      // --------------------------------------

      // --------------------------------------
      // ONLY FULFILLMENT STATUSES
      // --------------------------------------

      {
        $match: {
          status: {
            $in: [
              ORDER_STATUS.PENDING,
              ORDER_STATUS.CONFIRMED,
              ORDER_STATUS.PACKED,
              ORDER_STATUS.SHIPPED,
              ORDER_STATUS.OUT_FOR_DELIVERY,
              ORDER_STATUS.DELIVERED,
              ORDER_STATUS.CANCELLED,
            ],
          },
        },
      },

      {
        $group: {
          _id: "$status",

          count: {
            $sum: 1,
          },

          value: {
            $sum: "$totalPrice",
          },
        },
      },

      // --------------------------------------
      // SORT
      // --------------------------------------

      {
        $sort: {
          count: -1,
          _id: 1,
        },
      },

      // --------------------------------------
      // CLEAN OUTPUT
      // --------------------------------------

      {
        $project: {
          _id: 0,

          status: "$_id",

          count: 1,

          value: {
            $round: ["$value", 2],
          },
        },
      },
    ]);

    return statusData;
  } catch (error) {
    console.error("Order Analytics Error:", error);

    throw error;
  }
};

// ==========================================
// INVENTORY ANALYTICS
// ==========================================

export const getInventoryAnalytics = async () => {
  try {
    const products = await Product.find({})
      .select("name brand category price stock")
      .sort({
        stock: 1,
        name: 1,
      })
      .lean();

    // ========================================
    // INVENTORY GROUPS
    // ========================================

    const outOfStock = [];

    const lowStock = [];

    const healthyStock = [];

    let inventoryValue = 0;

    // ========================================
    // PROCESS PRODUCTS ONCE
    // ========================================

    for (const product of products) {
      const stock = Number(product.stock) || 0;

      const price = Number(product.price) || 0;

      // --------------------------------------
      // INVENTORY VALUE
      // --------------------------------------

      inventoryValue += price * stock;

      // --------------------------------------
      // STOCK CLASSIFICATION
      // --------------------------------------

      if (stock === 0) {
        outOfStock.push(product);
      } else if (stock <= LOW_STOCK_THRESHOLD) {
        lowStock.push(product);
      } else {
        healthyStock.push(product);
      }
    }

    // ========================================
    // FORMAT PRODUCT
    // ========================================

    const formatInventoryProduct = (product) => ({
      name: product.name,

      brand: product.brand,

      category: product.category,

      stock: product.stock,
    });

    // ========================================
    // RETURN
    // ========================================

    return {
      threshold: LOW_STOCK_THRESHOLD,

      totalProducts: products.length,

      outOfStockCount: outOfStock.length,

      lowStockCount: lowStock.length,

      healthyStockCount: healthyStock.length,

      inventoryValue: Number(inventoryValue.toFixed(2)),

      outOfStockProducts: outOfStock.map(formatInventoryProduct),

      lowStockProducts: lowStock.map(formatInventoryProduct),
    };
  } catch (error) {
    console.error("Inventory Analytics Error:", error);

    throw error;
  }
};
