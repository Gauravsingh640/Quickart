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

        sender: {

          name: "QuickArt",

          email:
          "gauravsingh71205@gmail.com",
        },

        to: [
          {
            email,
          },
        ],

        subject:
        "QuickArt Admin Access Granted 🚀",

        
        htmlContent:`

        <div
        style="
        background:#020617;
        padding:50px 20px;
        font-family:Arial,sans-serif;
        "
        >

        <div
            style="
            max-width:650px;
            margin:auto;
            background:white;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 10px 40px rgba(0,0,0,0.25);
            "
        >

            <!-- TOP BAR -->

            <div
            style="
            height:6px;
            background:linear-gradient(
            90deg,
            #2563eb,
            #7c3aed,
            #ec4899
            );
            "
            >
            </div>

            <!-- HEADER -->

            <div
            style="
            background:linear-gradient(
            135deg,
            #2563eb,
            #7c3aed
            );

            padding:45px 30px;
            text-align:center;
            color:white;
            "
            >

            <div
                style="
                font-size:55px;
                margin-bottom:12px;
                "
            >
                🚀
            </div>

            <h1
                style="
                margin:0;
                font-size:38px;
                letter-spacing:1px;
                "
            >
                QUICKART
            </h1>

            <p
                style="
                margin-top:12px;
                font-size:17px;
                opacity:0.92;
                "
            >
                Admin Access Successfully Granted
            </p>

            </div>

            <!-- BODY -->

            <div
            style="
            padding:45px 40px;
            color:#1e293b;
            "
            >

            <h2
                style="
                margin-top:0;
                color:#0f172a;
                font-size:30px;
                "
            >
                Congratulations ${firstName} 🎉
            </h2>

            <p
                style="
                font-size:17px;
                line-height:1.9;
                color:#475569;
                "
            >
                Your QuickArt account has been upgraded to
                <strong
                style="
                color:#2563eb;
                "
                >
                Admin Access
                </strong>.
            </p>

            <p
                style="
                font-size:16px;
                line-height:1.9;
                color:#475569;
                "
            >
                You now have complete access to platform management tools and administrative controls.
            </p>

            <!-- FEATURES -->

            <div
                style="
                margin-top:30px;
                background:#f8fafc;
                border-radius:14px;
                padding:25px;
                "
            >

                <h3
                style="
                margin-top:0;
                color:#0f172a;
                "
                >
                Your New Permissions
                </h3>

                <table
                width="100%"
                style="
                margin-top:15px;
                "
                >

                <tr>

                    <td
                    style="
                    padding:10px 0;
                    color:#334155;
                    "
                    >
                    ✅ Manage Products
                    </td>

                    <td
                    style="
                    padding:10px 0;
                    color:#334155;
                    "
                    >
                    ✅ Manage Orders
                    </td>

                </tr>

                <tr>

                    <td
                    style="
                    padding:10px 0;
                    color:#334155;
                    "
                    >
                    ✅ Access Dashboard
                    </td>

                    <td
                    style="
                    padding:10px 0;
                    color:#334155;
                    "
                    >
                    ✅ Platform Controls
                    </td>

                </tr>

                </table>

            </div>

            <!-- BUTTON -->

            <div
                style="
                text-align:center;
                margin-top:40px;
                "
            >

                <a
                href="https://quickart-one.vercel.app"

                style="
                background:linear-gradient(
                135deg,
                #2563eb,
                #7c3aed
                );

                color:white;
                padding:16px 34px;
                border-radius:12px;
                text-decoration:none;
                font-size:16px;
                font-weight:bold;
                display:inline-block;
                box-shadow:0 8px 20px rgba(37,99,235,0.35);
                "
                >

                Open Admin Dashboard

                </a>

            </div>

            </div>

            <!-- FOOTER -->

            <div
            style="
            background:#f8fafc;
            padding:25px;
            text-align:center;
            "
            >

            <p
                style="
                margin:0;
                color:#64748b;
                font-size:14px;
                "
            >
                Welcome to the QuickArt Admin Team 🚀
            </p>

            </div>

        </div>

        </div>
        `

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
      "ADMIN MAIL SENT SUCCESSFULLY"
    );

    console.log(response.data);

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

