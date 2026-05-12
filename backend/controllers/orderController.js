import { Order }
from "../models/orderModel.js";

export const createOrder =
  async (req, res) => {

    try {

      console.log(req.body);

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