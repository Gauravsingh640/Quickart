import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const verifyEmail = async (token, email) => {

  try {

    console.log("verifyEmail function called");

    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {

        user: process.env.MAIL_USER,

        pass: process.env.MAIL_PASS,
      },
    });

    console.log("Transporter Created");

    const mailConfigurations = {

      from: process.env.MAIL_USER,

      to: email,

      subject: "Email Verification",

      text: `Verify Email:
      
http://localhost:5173/verify/${token}`,
    };

    const info = await transporter.sendMail(mailConfigurations);

    console.log("Email Sent Successfully");

    console.log(info);

  } catch (error) {

    console.log("MAIL ERROR:");

    console.log(error);
  }
};