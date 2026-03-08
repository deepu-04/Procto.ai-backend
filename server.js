import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

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

// connect database
connectDB();

// create http server
const httpServer = createServer(app);

// allowed frontend domains
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://procto-ai-frontend.vercel.app",
  "https://procto-ai-frontend-git-main-deepu-04s-projects.vercel.app",
  "https://proctoai-frontend.vercel.app",
  "https://proctoai.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= ROUTES =================

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
  res.json({
    status: "OK",
    message: "Procto.ai backend running"
  });
});

// ================= SOCKET =================

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// ================= ERROR MIDDLEWARE =================

app.use(notFound);
app.use(errorHandler);

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});