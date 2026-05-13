import transporter
from "./mail.js";

export const sendOrderMail =
  async (
    email,
    items,
    address,
    totalPrice
  ) => {

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
    try{
        await transporter.sendMail({

        from:
            process.env.SMTP_EMAIL,

        to:
            email,

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

            </div>
        `,
        });
    }catch(error){
        console.log("Error sending email:", error);
    }
};