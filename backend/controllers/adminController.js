import { User }
from "../models/userModel.js";

import { Product }
from "../models/productModel.js";

import { Order }
from "../models/orderModel.js";

export const getAdminStats =
async (req, res) => {

  try {

    // USERS

    const totalUsers =
    await User.countDocuments({

      isVerified:true,
    });

    // PRODUCTS

    const totalProducts =
    await Product.countDocuments();

    // ORDERS

    const totalOrders =
    await Order.countDocuments();

    // SALES

    const paidOrders =
    await Order.find({

      status:"Paid",
    });

    const totalSales =
    paidOrders.reduce(

      (acc, item) =>

        acc + item.totalPrice,

      0
    );

    return res.status(200)
    .json({

      success:true,

      totalUsers,

      totalProducts,

      totalOrders,

      totalSales,
    });

  }

  catch(error){

    return res.status(500)
    .json({

      success:false,

      message:error.message,
    });
  }
};