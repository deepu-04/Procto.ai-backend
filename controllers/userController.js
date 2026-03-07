import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// Helper to generate the token string for the frontend JSON response
const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    // This sets the HTTP-only cookie
    generateToken(res, user._id);
    
    // Generate the token string to send to the frontend
    const token = signToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Frontend uses this to route to the correct dashboard
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // This sets the HTTP-only cookie
  generateToken(res, user._id);

  // Generate the token string to send to the frontend
  const token = signToken(user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role, // Frontend uses this to route to the correct dashboard
    token: token,
  });
});

// 🔥 Unified Google Auth Controller
export const googleAuth = asyncHandler(async (req, res) => {
  const { name, email, uid, role } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    // IF USER EXISTS -> Log them in using their ORIGINAL role from the database
    generateToken(res, user._id);
    const token = signToken(user._id);
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Guarantees they go to their original dashboard
      token: token,
    });
  } else {
    // IF USER DOES NOT EXIST -> Register them automatically with the selected role
    user = await User.create({
      name,
      email,
      password: uid, // Use their Google UID as a secure placeholder password
      role: role || 'student', // Defaults to student if no role is provided
    });

    if (user) {
      generateToken(res, user._id);
      const token = signToken(user._id);
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Routes new user to their chosen dashboard
        token: token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});