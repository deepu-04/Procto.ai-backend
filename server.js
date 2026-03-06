

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
  console.warn("OPENAI_API_KEY is NOT loaded from .env");
} else {
  console.log("OPENAI_API_KEY loaded successfully");
}



connectDB();



const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});



app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/cheatinglogs", cheatingLogsRoutes);


app.use("/api/ai", aiRoutes);
app.use("/api/user", analyticsRoutes);


app.get("/api/health", (req, res) => {
  res.json({
    message: "API running 🚀",
  });
});



io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join-interview", ({ roomId, role, email }) => {
    socket.join(roomId);

    console.log(`${role} (${email}) joined room: ${roomId}`);

    socket.to(roomId).emit("user-connected", {
      socketId: socket.id,
      role,
      email,
    });
  });

  socket.on("signal", ({ roomId, signalData }) => {
    socket.to(roomId).emit("signal", signalData);
  });

  socket.on("message", ({ roomId, message, sender }) => {
    io.to(roomId).emit("message", { message, sender });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});



app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});