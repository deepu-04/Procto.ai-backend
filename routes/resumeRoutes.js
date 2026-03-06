import express from 'express';
import multer from 'multer';


import { genAI } from '../config/gemini.js';


import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });


router.post('/parse-jd', upload.single('jd'), async (req, res) => {
  try {
    let jdText = '';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        jdText = pdfData.text;
      } else {
        
        jdText = req.file.buffer.toString('utf-8'); 
      }
    } 
    
    else if (req.body && req.body.text) {
      jdText = req.body.text;
    } 
    
    else {
      return res.status(400).json({ 
        success: false, 
        message: 'No Job Description provided. Please upload a file or send text.' 
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      Extract the core technical skills, frameworks, and tools required from the following Job Description.
      Return ONLY a comma-separated list of skills. Do not include any other text, markdown, or explanations.
      Job Description:
      """
      ${jdText}
      """
    `;

    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();
    
    
    const skillsArray = rawResponse
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

   
    res.status(200).json({ 
      success: true, 
      skills: skillsArray 
    });

  } catch (error) {
    console.error('Backend Parse JD Error:', error);
  
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process the Job Description on the server',
      error: error.message 
    });
  }
});

export default router;