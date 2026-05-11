import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const verifyEmail = async (token, email) => {

  try {

    console.log(process.env.MAIL_USER);
    console.log(process.env.MAIL_PASS);

    console.log("verifyEmail function called");

    const transporter = nodemailer.createTransport({

      host: "smtp-relay.brevo.com",

      port: 587,

      secure: false,

      requireTLS: true,

      auth: {

        user: process.env.MAIL_USER,

        pass: process.env.MAIL_PASS,
      },

      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("Transporter Created");

    const mailConfigurations = {

      from: process.env.MAIL_USER,

      to: email,

      subject: "Email Verification",

      text: `Verify Email:
      
https://quickart-one.vercel.app/verify/${token}`,
    };

    console.log("Sending Mail...");

    const info =
      await transporter.sendMail(
        mailConfigurations
      );

    console.log("Mail Sent");

    console.log(
      "Email Sent Successfully"
    );

    console.log(info);

  } catch (error) {

    console.log("MAIL ERROR:");

    console.log(error);
  }
};