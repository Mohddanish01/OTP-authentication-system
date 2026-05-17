import { User } from "../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyMail } from "../config/verify-mail.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    //! email verify
    verifyMail(email, token);

    //! after verification ==> save  token
    newUser.token = token;

    //! save user data
    newUser.save();

    //! send res ==> user created
    res.status(200).json({
      success: true,
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        success: false,
        message: "Token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "Token Expired",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }

    const user = await User.findById(decoded);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    user.token = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: false,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {};
export const logout = async (req, res) => {};
export const forgotPassword = async (req, res) => {};
export const verifyOtp = async (req, res) => {};
export const changePassword = async (req, res) => {};
