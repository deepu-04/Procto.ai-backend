import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { ipRiskMiddleware } from "../middleware/ipRiskMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/network/check
 * @desc    Detect VPN / Proxy / Network risk
 * @access  Private
 */
router.get("/check", protect, ipRiskMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    networkRisk: req.ipRisk,
  });
});

export default router;
