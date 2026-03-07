import express from "express";
import {
  authUser,
  logoutUser,
  registerUser,
  googleAuth 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/google", googleAuth); 
router.post("/logout", logoutUser);

export default router;