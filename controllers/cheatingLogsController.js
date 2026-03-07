import CheatingLog from "../models/cheatingLogModel.js";


export const saveCheatingLog = async (req, res) => {
  try {
    const log = new CheatingLog(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getCheatingLogs = async (req, res) => {
  try {
    const logs = await CheatingLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};