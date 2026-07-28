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
    await Order.find();

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

export const addProductStock = async (req, res) => {
  try {

    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.stock += Number(quantity);

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      product,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};