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

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is NOT loaded");
} else {
  console.log("OPENAI_API_KEY loaded");
}

// connect database
connectDB();

// create http server
const httpServer = createServer(app);

// ✅ allowed frontend domains
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://procto-ai-frontend.vercel.app",
  "https://procto-ai-frontend-git-main-deepu-04s-projects.vercel.app",
  "https://proctoai-frontend.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

// ✅ CORS middleware - FIXED
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ socket.io config
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/cheatinglogs", cheatingLogsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/user", analyticsRoutes);

// health route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Procto.ai backend running",
  });
});

// socket connection
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join-interview", (data) => {
    const { roomId, role, email } = data;

    socket.join(roomId);

    console.log(role + " (" + email + ") joined room: " + roomId);

    socket.to(roomId).emit("user-connected", {
      socketId: socket.id,
      role,
      email,
    });
  });

  socket.on("signal", (data) => {
    const { roomId, signalData } = data;
    socket.to(roomId).emit("signal", signalData);
  });

  socket.on("message", (data) => {
    const { roomId, message, sender } = data;
    io.to(roomId).emit("message", {
      message,
      sender,
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// error middleware
app.use(notFound);
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});