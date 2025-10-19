import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Chat from "../models/chatModel.js";

const gettoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User // Register User // Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    const token = gettoken(user._id);
    return res
      .status(201)
      .json({ message: "User created successfully", user, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login user // Login user // Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = gettoken(user._id);
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user,
        token,
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get user // Get user  // Get user
export const getUser = async (req, res) => {
  try {
    const id = req.user;

    const user = await User.findById(id).select("-password");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get the PublicIMg

export const getPublicImg = async (req, res) => {
  try {
    const PublicIMg = await Chat.aggregate([
      {
        $unwind: "$messages",
      },
      {
        $match: { "messages.isImage": true, isPublished: true },
      },
      {
        $project: {
          _id: 0,
          image: "$messages.content",
          userName: 1,
        },
      },
    ]);

    return res.status(200).json({ success: true, PublicIMg });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
