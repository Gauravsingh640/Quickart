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
              src="${item.image}"
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
          "gauravsingh71205@gmail.com",
        },

        to:[
          {
            email,
          },
        ],

        subject:
        "Order Placed Successfully 🎉",

        htmlContent:`

        <div
          style="
          background:#0f172a;
          padding:40px;
          font-family:Arial,sans-serif;
          "
        >

          <div
            style="
            max-width:700px;
            margin:auto;
            background:white;
            border-radius:14px;
            overflow:hidden;
            "
          >

            <!-- HEADER -->

            <div
              style="
              background:linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
              );

              color:white;
              padding:35px;
              text-align:center;
              "
            >

              <h1
                style="
                margin:0;
                font-size:34px;
                "
              >
                QUICKART 🛒
              </h1>

              <p
                style="
                margin-top:10px;
                font-size:16px;
                opacity:0.9;
                "
              >
                Your Order Has Been Confirmed 🎉
              </p>

            </div>

            <!-- BODY -->

            <div
              style="
              padding:35px;
              color:#1e293b;
              "
            >

              <h2>
                Thank You For Shopping With Us ❤️
              </h2>

              <p
                style="
                line-height:1.8;
                "
              >
                Your order has been successfully placed and is now being processed.
              </p>

              <!-- ADDRESS -->

              <div
                style="
                background:#f8fafc;
                padding:20px;
                border-radius:10px;
                margin-top:25px;
                "
              >

                <h3
                  style="
                  margin-top:0;
                  color:#2563eb;
                  "
                >
                  Delivery Address
                </h3>

                <p
                  style="
                  line-height:1.8;
                  margin:0;
                  "
                >

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

              </div>

              <!-- ORDER SUMMARY -->

              <h3
                style="
                margin-top:35px;
                color:#2563eb;
                "
              >
                Order Summary
              </h3>

              <table
                width="100%"
                style="
                border-collapse:collapse;
                margin-top:15px;
                "
              >

                <thead>

                  <tr
                    style="
                    background:#eff6ff;
                    "
                  >

                    <th
                      style="
                      padding:14px;
                      text-align:left;
                      "
                    >
                      Product
                    </th>

                    <th
                      style="
                      padding:14px;
                      "
                    >
                      Qty
                    </th>

                    <th
                      style="
                      padding:14px;
                      "
                    >
                      Price
                    </th>

                  </tr>

                </thead>

                <tbody>

                  ${itemsHtml}

                </tbody>

              </table>

              <!-- TOTAL -->

              <div
                style="
                margin-top:30px;
                text-align:right;
                "
              >

                <h2
                  style="
                  color:#111827;
                  "
                >

                  Total:
                  ₹${totalPrice}

                </h2>

              </div>

              <!-- BUTTON -->

              <div
                style="
                text-align:center;
                margin-top:35px;
                "
              >

                <a
                  href="https://quickart-one.vercel.app/profile/orders"

                  style="
                  background:#2563eb;
                  color:white;
                  padding:14px 28px;
                  border-radius:8px;
                  text-decoration:none;
                  font-weight:bold;
                  display:inline-block;
                  "
                >

                  View Orders

                </a>

              </div>

            </div>

            <!-- FOOTER -->

            <div
              style="
              background:#f8fafc;
              padding:20px;
              text-align:center;
              color:#64748b;
              font-size:14px;
              "
            >

              Thank you for choosing QuickArt ❤️

            </div>

          </div>

        </div>
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
