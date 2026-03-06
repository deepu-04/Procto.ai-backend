import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if token exists in the Authorization header (Sent from Vercel)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // 2. Fallback: Check if token exists in cookies (Works best for localhost)
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 3. Reject if no token is found in either location
  if (!token) {
    return res.status(401).json({
      message: "Not Authorized – No Token",
    });
  }

  // 4. Verify token and find user
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Using `decoded.userId || decoded.id` ensures it works depending on how you signed the JWT
    req.user = await User.findById(decoded.userId || decoded.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not Authorized – Invalid Token",
    });
  }
});