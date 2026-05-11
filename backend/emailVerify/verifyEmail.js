import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const verifyEmail = async (token, email) => {

  try {

    console.log(process.env.MAIL_USER);
    console.log(process.env.MAIL_PASS);

    console.log("verifyEmail function called");

    const transporter = nodemailer.createTransport({

      host: "smtp.gmail.com",

      port: 465,

      secure: true,

      auth: {

        user: process.env.MAIL_USER,

        pass: process.env.MAIL_PASS,
      },

      connectionTimeout: 10000,
    });

    console.log("Transporter Created");

    const mailConfigurations = {

      from: process.env.MAIL_USER,

      to: email,

      subject: "Email Verification",

      text: `Verify Email:
      
https://quickart-one.vercel.app/verify/${token}`,
    };

    const info =
      await transporter.sendMail(
        mailConfigurations
      );

    console.log(
      "Email Sent Successfully"
    );

    console.log(info);

  } catch (error) {

    console.log("MAIL ERROR:");

    console.log(error);
  }
};