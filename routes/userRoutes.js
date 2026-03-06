import express from "express";
import {
  authUser,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

// Changed from "/" to "/register"
router.post("/register", registerUser);

// Changed from "/auth" to "/login"
router.post("/login", authUser);

router.post("/logout", logoutUser);

export default router;