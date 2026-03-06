import express from "express";
import {
  saveCheatingLog,
  getCheatingLogs,
} from "../controllers/cheatingLogsController.js";

const router = express.Router();

router.route("/")
  .post(saveCheatingLog)
  .get(getCheatingLogs);

export default router;