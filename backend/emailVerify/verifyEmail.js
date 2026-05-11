import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const verifyEmail = async (token, email) => {

  try {

    console.log("========== VERIFY EMAIL ==========");

    console.log("BREVO API KEY:");
    console.log(process.env.BREVO_API_KEY);

    console.log("USER EMAIL:");
    console.log(email);

    console.log("TOKEN:");
    console.log(token);

    console.log("Sending request to Brevo API...");

    const response = await axios.post(

      "https://api.brevo.com/v3/smtp/email",

      {

        sender: {

          name: "Quickart",

          email: "gauravsingh71205@gmail.com",
        },

        to: [
          {
            email: email,
          },
        ],

        subject: "Email Verification",

        textContent: `Verify Email:

https://quickart-one.vercel.app/verify/${token}`,
      },

      {

        headers: {

          accept: "application/json",

          "api-key":
            process.env.BREVO_API_KEY,

          "content-type":
            "application/json",
        },
      }
    );

    console.log("========== SUCCESS ==========");

    console.log("Email Sent Successfully");

    console.log(response.data);

  } catch (error) {

    console.log("========== MAIL ERROR ==========");

    if (error.response) {

      console.log("STATUS:");
      console.log(error.response.status);

      console.log("DATA:");
      console.log(error.response.data);

    } else {

      console.log(error.message);
    }
  }
};