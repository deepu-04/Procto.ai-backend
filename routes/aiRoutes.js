import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRequire } from "module";
import dotenv from "dotenv";

dotenv.config();

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const router = express.Router();


const upload = multer({
  storage: multer.memoryStorage(),
});



if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});



function cleanAIResponse(text) {
  if (!text) return "";

  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/\n/g, " ")
    .trim();
}


router.post("/analyze-jd", async (req, res) => {
  try {
    const { jd } = req.body;

    if (!jd || jd.trim() === "") {
      return res.status(400).json({
        message: "Job description required",
      });
    }

    const result = await model.generateContent(
      `Extract ONLY technical skills from this job description.
Return comma separated list only.

${jd}`
    );

    const response = await result.response;

    const text = cleanAIResponse(response.text());

    const skills = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return res.json({ skills });
  } catch (error) {
    console.error("❌ JD ANALYSIS ERROR:", error);

    return res.status(500).json({
      message: "JD analysis failed",
      error: error.message,
    });
  }
});


router.post("/analyze-jd-file", upload.single("jdFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Job Description file missing",
      });
    }

    let jdText = "";

    if (req.file.originalname.endsWith(".pdf")) {
      const pdfData = await pdfParse(req.file.buffer);
      jdText = pdfData.text;
    } else if (req.file.originalname.endsWith(".docx")) {
      const docx = await mammoth.extractRawText({
        buffer: req.file.buffer,
      });

      jdText = docx.value;
    } else {
      return res.status(400).json({
        message: "Upload PDF or DOCX file",
      });
    }

    const result = await model.generateContent(
      `Extract ONLY technical skills from this job description.

${jdText}`
    );

    const response = await result.response;

    const text = cleanAIResponse(response.text());

    const skills = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return res.json({ skills });
  } catch (error) {
    console.error("❌ JD FILE ERROR:", error);

    return res.status(500).json({
      message: "JD file analysis failed",
      error: error.message,
    });
  }
});



router.post("/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file missing",
      });
    }

    let { skills } = req.body;

    if (!skills) {
      return res.status(400).json({
        message: "Skills required",
      });
    }

    if (typeof skills === "string") {
      skills = skills.split(",");
    }

    let resumeText = "";

    if (req.file.originalname.endsWith(".pdf")) {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } else if (req.file.originalname.endsWith(".docx")) {
      const docx = await mammoth.extractRawText({
        buffer: req.file.buffer,
      });

      resumeText = docx.value;
    } else {
      return res.status(400).json({
        message: "Upload PDF or DOCX resume",
      });
    }

    const result = await model.generateContent(
      `Required skills: ${skills.join(",")}

Resume:
${resumeText}

Return ONLY the required skills the candidate has as comma separated list.`
    );

    const response = await result.response;

    const text = cleanAIResponse(response.text());

    const matched = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return res.json({ matched });
  } catch (error) {
    console.error("RESUME ERROR:", error);

    return res.status(500).json({
      message: "Resume analysis failed",
      error: error.message,
    });
  }
});



router.post("/generate-exam", async (req, res) => {
  try {
    let { skills } = req.body;

    if (!skills || skills.length === 0) {
      return res.status(400).json({
        message: "Skills required",
      });
    }

    if (typeof skills === "string") {
      skills = skills.split(",");
    }

    const result = await model.generateContent(
      `Generate 5 MCQ questions for these skills:

${skills.join(",")}

Return ONLY JSON format:

[
{
"question": "",
"options": ["","","",""],
"correctAnswer": ""
}
]`
    );

    const response = await result.response;

    const text = cleanAIResponse(response.text());

    let exam;

    try {
      exam = JSON.parse(text);
    } catch (err) {
      console.error("⚠️ JSON Parse Failed:", text);

      return res.status(500).json({
        message: "AI returned invalid JSON",
      });
    }

    return res.json({ exam });
  } catch (error) {
    console.error("❌ EXAM ERROR:", error);

    return res.status(500).json({
      message: "Exam generation failed",
      error: error.message,
    });
  }
});

export default router;