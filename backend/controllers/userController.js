import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check user exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // hash password (omitted for brevity, but should be included in production code)
    
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password : hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    verifyEmail(token, email);
    newUser.token = token;
    // save (optional, create already saves)
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
