// import { Order } from "../models/orderModel.js";
// import { Product } from "../models/productModel.js";
// import { User } from "../models/userModel.js";

// export const getOverviewAnalytics = async () => {
//   const [orders, products, users] = await Promise.all([
//     Order.find({ status: "Delivered" }),
//     Product.countDocuments(),
//     User.countDocuments(),
//   ]);

//   const totalRevenue = orders.reduce(
//     (sum, order) => sum + order.totalPrice,
//     0
//   );

//   return {
//     totalRevenue,
//     totalOrders: orders.length,
//     totalProducts: products,
//     totalUsers: users,
//   };
// };


import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js"; 

export const getOverviewAnalytics = async () => {
  try {
    const orders = await Order.find({}).select("totalPrice status items");

    console.log("\n========== ORDERS ==========\n");

    console.table(
      orders.map((order) => ({
        totalPrice: order.totalPrice,
        status: order.status,
      }))
    );

    console.log("\n========== ITEMS ==========\n");

    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}`);

      order.items.forEach((item) => {
        console.log({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        });
      });

      console.log("----------------------------");
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({
        isVerified:true
    });

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: orders.length,
      totalProducts,
      totalUsers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTopSellingProducts = async () => {
  const topProducts = await Order.aggregate([
    {
      $match: {
        status: "Delivered",
      },
    },

    {
      $unwind: "$items",
    },

    {
      $group: {
        _id: "$items.id",
        name: { $first: "$items.title" },
        image: { $first: "$items.image" },
        totalSold: { $sum: "$items.quantity" },
        revenue: {
          $sum: {
            $multiply: ["$items.price", "$items.quantity"],
          },
        },
      },
    },

    {
      $sort: {
        totalSold: -1,
      },
    },

    {
      $limit: 5,
    },

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
}; 

export const getLowStockProducts = async () => {
  const products = await Product.find({
    stock: { $lte: 5 }, // 5 ya usse kam stock
  })
    .select("name stock price images category")
    .sort({ stock: 1 });

  return products;
};

export const getMonthlySales = async () => {
  const monthlySales = await Order.aggregate([
    {
      $match: {
        status: "Delivered",
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: {
          $sum: "$totalPrice",
        },
        orders: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
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
};
 
export const getCategorySales = async () => {
  const categorySales = await Order.aggregate([
    {
      $match: {
        status: "Delivered",
      },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $group: {
        _id: "$product.category",
        sold: {
          $sum: "$items.quantity",
        },
        revenue: {
          $sum: {
            $multiply: [
              "$items.price",
              "$items.quantity"
            ]
          }
        }
      }
    },
    {
      $sort: {
        revenue: -1
      }
    }
  ]);

  return categorySales;
};