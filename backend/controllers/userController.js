import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
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

export const verify = async (req, res) => {
  try {

    // TOKEN URL SE LO
    const { token } = req.params;

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired Token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // ALREADY VERIFIED
    if (user.isVerified) {
      return res.json({
        success: true,
        message: "Email Already Verified",
      });
    }

    // VERIFY USER
    user.isVerified = true;
    await user.save();

    return res.json({
      success: true,
      message: "Email Verified Successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reVerify = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ALREADY VERIFIED
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // NEW TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // SEND MAIL AGAIN
    verifyEmail(token, email);

    return res.status(200).json({
      success: true,
      message: "Verification email sent again",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // 1️⃣ validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ user check
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // 3️⃣ password check
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // 🚨 4️⃣ EMAIL VERIFY CHECK (MOST IMPORTANT)
    if (!existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // 5️⃣ LOGIN TOKEN
    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    existingUser.isLoggedIn= true;
    await existingUser.save();

    const existingSession = await Session.findOne({ userId: existingUser._id });
    if (existingSession) { 
      await existingSession.deleteOne({ userId: existingUser._id });
    }  



    await Session.create({ userId: existingUser._id });
    return res.status(200).json({
      success: true,
      message: `Welcome back, ${existingUser.firstName}`,
      user: existingUser,
      accessToken,
      refreshToken,
    });
    // return res.status(200).json({
    //   success: true,
    //   message: "Login successful",
    //   token: token,
    // });

  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.id;
    await Session.deleteMany({ userId:userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};