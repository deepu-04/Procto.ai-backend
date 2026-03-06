import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";


dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("CRITICAL ERROR: GEMINI_API_KEY is missing from .env file.");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);