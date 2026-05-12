import { Order }
from "../models/orderModel.js";

export const createOrder =
  async (req, res) => {

    try {
      console.log("BODY:");
      console.log(req.body);

      console.log("REQ ID:");
      console.log(req.id); 
      const {

        items,
        totalPrice,

      } = req.body;

      const order =
        await Order.create({

          user: req.id,

          items,

          totalPrice,
        });

      return res.status(201).json({

        success: true,

        message:
          "Order placed successfully",

        order,
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message: error.message,
      });
    }
};

export const getMyOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find({

          user: req.id,
        });

      return res.status(200).json({

        success: true,

        orders,
      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message: error.message,
      });
    }
};