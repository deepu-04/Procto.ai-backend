# Procto.ai – AI Proctored Interview & Examination Platform (Backend)

Procto.ai is an AI-powered platform designed to conduct **secure online interviews and examinations**.  
The backend system handles **resume analysis, AI-powered exam generation, authentication, data storage, and real-time proctoring services**.

This repository contains the **backend services and APIs** responsible for powering the Procto.ai platform.

---

# Project Overview

The backend manages the core functionality of the Procto.ai system including:

- Resume and Job Description processing
- AI-based interview and exam question generation
- Secure user authentication
- Exam session management
- Real-time proctoring data handling
- Student performance tracking
- Admin and teacher management APIs

---

# Technology Stack

The backend application is built using the following technologies:

- Node.js
- Express.js
- Firebase Admin SDK
- Firestore Database
- Multer (File Upload)
- JWT Authentication
- Socket.io
- OpenAI API (for AI question generation)
- CORS
- Dotenv

---

# Backend Architecture

The backend follows a **RESTful API architecture** to communicate with the frontend.

Key modules include:

- Authentication APIs
- Resume Processing
- AI Question Generation
- Exam Management
- Proctoring Monitoring
- Student Data Management

---

# Project Structure

```
backend
│
├── controllers
├── routes
├── middleware
├── services
├── utils
├── firebase
│
├── server.js
└── package.json
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/deepu-04/Procto.ai-backend.git
```

Navigate to the project directory:

```bash
cd Procto.ai-backend
```

Install dependencies:

```bash
npm install
```

---

# Running the Backend Server

Start the development server:

```bash
npm start
```

or

```bash
node server.js
```

The backend server will run on:

```
http://localhost:5000
```

---

# Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
PORT=5000

FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

OPENAI_API_KEY=
JWT_SECRET=
```

---

# API Features

The backend provides APIs for:

- User authentication
- Resume upload and analysis
- Job description analysis
- AI-generated interview questions
- Exam session management
- Proctoring event monitoring
- Student performance reports

---

# Deployment

The backend can be deployed on:

- Render
- Railway
- AWS
- DigitalOcean
- Vercel Serverless (optional)

Recommended platform: **Render**

---

# Future Improvements

Planned backend improvements include:

- AI cheating detection models
- Voice and facial analysis integration
- Advanced analytics dashboard APIs
- Automated interview evaluation
- AI candidate performance scoring

---

# Contributing

Contributions are welcome.

1. Fork the repository  
2. Create a new feature branch  
3. Commit your changes  
4. Submit a pull request  

---

# License

This project is licensed under the **MIT License**.

---

# Frontend Repository

Frontend Link :  
https://github.com/deepu-04/procto-ai-frontend
