import axios from "axios";

export const sendOrderMail =
  async (
    email,
    items,
    address,
    totalPrice
  ) => {

    try {

      console.log(
        "SEND ORDER MAIL CALLED"
      );

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

      const response =
        await axios.post(

          "https://api.brevo.com/v3/smtp/email",

          {

            sender: {

              name:
                "Quickart",

              email:
                "gauravsingh71205@gmail.com",
            },

            to: [
              {
                email,
              },
            ],

            subject:
              "Order Placed Successfully 🎉",

            htmlContent: `

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
          },

          {

            headers: {

              accept:
                "application/json",

              "api-key":
                process.env.BREVO_API_KEY,

              "content-type":
                "application/json",
            },
          }
        );

      console.log(
        "ORDER MAIL SENT SUCCESSFULLY"
      );

      console.log(response.data);

    } catch (error) {

      console.log(
        "ORDER MAIL ERROR:"
      );

      console.log(
        error.response?.data ||
        error.message
      );
    }
};