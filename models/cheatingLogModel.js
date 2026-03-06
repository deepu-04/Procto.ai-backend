import mongoose from "mongoose";

const cheatingLogSchema = new mongoose.Schema(
  {
    examId: { type: String, required: true },
    username: String,
    email: String,

    VPN_DETECTED: { type: Number, default: 0 },
    MULTIPLE_IPS: { type: Number, default: 0 },
    DEV_TOOLS_OR_VM: { type: Number, default: 0 },
    FULLSCREEN_EXIT: { type: Number, default: 0 },
    TAB_SWITCH: { type: Number, default: 0 },
    WINDOW_BLUR: { type: Number, default: 0 },
    PROHIBITED_OBJECT: { type: Number, default: 0 },
    AUDIO_ANOMALY: { type: Number, default: 0 },
    FACE_LOST: { type: Number, default: 0 },
    NETWORK_DISCONNECT: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CheatingLog = mongoose.model("CheatingLog", cheatingLogSchema);

export default CheatingLog;