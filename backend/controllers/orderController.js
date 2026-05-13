// import { Order }
// from "../models/orderModel.js";

// export const createOrder =
//   async (req, res) => {

//     try {
//       console.log("BODY:");
//       console.log(req.body);

//       console.log("REQ ID:");
//       console.log(req.id); 
//       const {

//         items,
//         totalPrice,

//       } = req.body;

//       const order =
//         await Order.create({

//           user: req.id,

//           items,

//           totalPrice,
//         });

//       return res.status(201).json({

//         success: true,

//         message:
//           "Order placed successfully",

//         order,
//       });

//     } catch (error) {

//       return res.status(500).json({

//         success: false,

//         message: error.message,
//       });
//     }
// };

// export const getMyOrders =
//   async (req, res) => {

//     try {

//       const orders =
//         await Order.find({

//           user: req.id,
//         });

//       return res.status(200).json({

//         success: true,

//         orders,
//       });

//     } catch (error) {

//       return res.status(500).json({

//         success: false,

//         message: error.message,
//       });
//     }
// };

// orderController.js

import { Order }
from "../models/orderModel.js";

import { User }
from "../models/userModel.js";

import transporter
from "../emailVerify/verifyEmail.js";

import {
  sendOrderMail,
} from "../utils/sendOrderMail.js";

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
        address,

      } = req.body;

      // FIND USER

      const user =
        await User.findById(
          req.id
        );

      // CREATE ORDER

      const order =
        await Order.create({

          user: req.id,

          items,

          totalPrice,

          address,
        });
      
      await sendOrderMail(

        user.email,

        items,

        address,

        totalPrice
      );

      // ITEMS HTML

      const itemsHtml =
        items.map(

          (item) => `

            <tr>

              <td style="padding:10px;">
                ${item.title}
              </td>

              <td style="padding:10px;">
                ${item.quantity}
              </td>

              <td style="padding:10px;">
                ₹${item.price}
              </td>

            </tr>
          `
        ).join("");

      // SEND MAIL

      await transporter.sendMail({

        from:
          process.env.SMTP_EMAIL,

        to:
          user.email,

        subject:
          "Order Placed Successfully 🎉",

        html: `

          <div
            style="
              font-family:sans-serif;
              padding:20px;
            "
          >

            <h2>
              Your Order Has Been Placed Successfully 🎉
            </h2>

            <p>
              Thank you for shopping with QUICKART.
            </p>

            <h3>
              Delivery Address
            </h3>

            <p>
              ${address.fullName}
              <br/>
              ${address.address}
              <br/>
              ${address.city},
              ${address.state}
              <br/>
              ${address.zipCode},
              ${address.country}
              <br/>
              ${address.phone}
            </p>

            <h3>
              Order Summary
            </h3>

            <table
              border="1"
              cellpadding="10"
              cellspacing="0"
              style="
                border-collapse:collapse;
              "
            >

              <tr>

                <th>
                  Product
                </th>

                <th>
                  Quantity
                </th>

                <th>
                  Price
                </th>

              </tr>

              ${itemsHtml}

            </table>

            <h2
              style="
                margin-top:20px;
              "
            >
              Total Amount:
              ₹${totalPrice}
            </h2>

            <p>
              Your order will be delivered soon 🚚
            </p>

          </div>
        `,
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