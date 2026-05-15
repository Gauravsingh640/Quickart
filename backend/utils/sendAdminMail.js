import axios from "axios";

export const sendAdminAccessMail =
async (
  email,
  firstName
) => {

  try {

    console.log(
      "SEND ADMIN MAIL CALLED"
    );

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
        "QuickArt Admin Access Granted 🚀",

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
            max-width:600px;
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

              padding:35px;
              text-align:center;
              color:white;
              "
            >

              <h1
                style="
                margin:0;
                font-size:34px;
                "
              >
                QUICKART 🚀
              </h1>

              <p
                style="
                margin-top:10px;
                font-size:16px;
                opacity:0.9;
                "
              >
                Admin Access Granted
              </p>

            </div>

            <!-- BODY -->

            <div
              style="
              padding:40px;
              color:#1e293b;
              "
            >

              <h2
                style="
                margin-top:0;
                color:#111827;
                "
              >
                Congratulations ${firstName} 🎉
              </h2>

              <p
                style="
                font-size:16px;
                line-height:1.8;
                "
              >
                Your QuickArt account has been successfully upgraded to
                <strong>
                Admin Access
                </strong>.
              </p>

              <p
                style="
                font-size:16px;
                line-height:1.8;
                "
              >
                You can now:
              </p>

              <ul
                style="
                line-height:2;
                padding-left:20px;
                color:#334155;
                "
              >

                <li>
                  Manage Products
                </li>

                <li>
                  Manage Orders
                </li>

                <li>
                  Access Dashboard
                </li>

                <li>
                  Control Platform Features
                </li>

              </ul>

              <!-- BUTTON -->

              <div
                style="
                text-align:center;
                margin-top:35px;
                "
              >

                <a
                  href="https://quickart-one.vercel.app"

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

                  Open Dashboard

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

              Welcome to the QuickArt Admin Team 🚀

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
      "ADMIN MAIL SENT SUCCESSFULLY"
    );

    console.log(
      response.data
    );

  }

  catch(error){

    console.log(
      "ADMIN MAIL ERROR:"
    );

    console.log(

      error.response?.data ||

      error.message
    );
  }
}; 