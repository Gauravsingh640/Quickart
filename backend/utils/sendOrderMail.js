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
      "========== ORDER MAIL DEBUG =========="
    );

    console.log("EMAIL:");
    console.log(email);

    console.log("ITEMS:");
    console.log(items);

    console.log("ADDRESS:");
    console.log(address);

    console.log("TOTAL PRICE:");
    console.log(totalPrice);

    console.log(
      "SEND ORDER MAIL CALLED"
    );

    // PRODUCTS HTML

    const itemsHtml =
    items.map(

      (item) => `

      <tr>

        <td
          style="
          padding:14px;
          border-bottom:1px solid #e2e8f0;
          "
        >

          <div
            style="
            display:flex;
            align-items:center;
            gap:10px;
            "
          >

            <img
              src="${item.image || "https://via.placeholder.com/60"}"
              width="60"
              height="60"
              style="
              border-radius:8px;
              object-fit:cover;
              "
            />

            <span>
              ${item.title}
            </span>

          </div>

        </td>

        <td
          style="
          padding:14px;
          border-bottom:1px solid #e2e8f0;
          text-align:center;
          "
        >
          ${item.quantity}
        </td>

        <td
          style="
          padding:14px;
          border-bottom:1px solid #e2e8f0;
          text-align:center;
          "
        >
          ₹${item.price}
        </td>

      </tr>
      `
    ).join("");

    const response =
    await axios.post(

      "https://api.brevo.com/v3/smtp/email",

      {

        sender:{

          name:"QuickArt",

          email:
          process.env.MAIL_USER,
        },

        to:[
          {
            email:String(email),
          },
        ],

        subject:
        "Order Placed Successfully 🎉",

        htmlContent:`

        <h1>
          Order Successful 🎉
        </h1>

        <p>
          Thank you for shopping with QuickArt.
        </p>

        <table
          border="1"
          cellpadding="10"
          cellspacing="0"
        >

          <tr>

            <th>
              Product
            </th>

            <th>
              Qty
            </th>

            <th>
              Price
            </th>

          </tr>

          ${itemsHtml}

        </table>

        <h2>
          Total:
          ₹${totalPrice}
        </h2>
        `,
      },

      {

        headers:{

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

    console.log(
      response.data
    );

  }

  catch(error){

    console.log(
      "ORDER MAIL ERROR:"
    );

    console.log(

      error.response?.data ||

      error.message
    );
  }
};
