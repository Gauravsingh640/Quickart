import nodemailer from "nodemailer";

export const sendAdminAccessMail =
async (email, firstName) => {

  try {

    const transporter =
    nodemailer.createTransport({

      host:
      process.env.MAIL_HOST,

      port:
      process.env.MAIL_PORT,

      auth:{

        user:
        process.env.MAIL_USER,

        pass:
        process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({

      from:process.env.MAIL_USER,

      to:email,

      subject:
      "QuickArt Admin Access Granted 🚀",

      html:`

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

          <div
            style="
            background:linear-gradient(
            135deg,
            #2563eb,
            #7c3aed
            );

            padding:30px;
            text-align:center;
            color:white;
            "
          >

            <h1
              style="
              margin:0;
              font-size:32px;
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
              line-height:1.7;
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
              line-height:1.7;
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

          <div
            style="
            background:#f8fafc;
            padding:20px;
            text-align:center;
            font-size:14px;
            color:#64748b;
            "
          >

            Welcome to the QuickArt Admin Team 🚀

          </div>

        </div>

      </div>
      `,
    });

    console.log(
      "Admin Mail Sent"
    );

  }

  catch(error){

    console.log(error);
  }
}; 
