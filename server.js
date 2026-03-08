import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// ================= ROUTES =================
import examRoutes from "./routes/examRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import networkRoutes from "./routes/networkRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import cheatingLogsRoutes from "./routes/cheatingLogsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

// ================= DATABASE =================
connectDB();

// ================= HTTP SERVER =================
const httpServer = createServer(app);

// ================= CORS CONFIG =================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://procto-ai-frontend.vercel.app",
  "https://procto-ai-frontend-git-main-deepu-04s-projects.vercel.app",
  "https://proctoai-frontend.vercel.app",
  "https://proctoai.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true
  })
);

// ================= MIDDLEWARE =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= API ROUTES =================

app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/cheatinglogs", cheatingLogsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/user", analyticsRoutes);

// ================= HEALTH CHECK =================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Procto.ai Backend",
    timestamp: new Date().toISOString()
  });
});

// ================= SOCKET.IO =================

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {

  console.log("Socket Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket Disconnected:", socket.id);
  });

});

// ================= ERROR HANDLERS =================

app.use(notFound);
app.use(errorHandler);

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Procto.ai Backend running on port ${PORT}`);
});