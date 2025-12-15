# 📄 AI Document Generator

An AI-powered web application that automatically generates clean, structured, and up-to-date documentation from a codebase.

Developers can upload a ZIP file or connect a GitHub repository, and the system analyzes the code to generate:
- README files
- Module summaries
- API documentation
- Architecture overviews

This reduces manual documentation effort and improves onboarding and code understanding.

---

## 🚀 Live Demo

- 🌐 **Frontend:** https://docuai.vercel.app  
- ⚙️ **Backend:** https://docuai-qjw1.onrender.com  
- 💻 **GitHub Repo:** https://github.com/Ayush8566/docuai  

*(Replace links if needed)*

---

## 🎯 Problem Statement

Writing and maintaining documentation is often:
- Time-consuming
- Ignored or delayed
- Quickly outdated

This creates problems such as:
- Slower onboarding for new developers
- Confusion about APIs and modules
- Reduced code quality and maintainability

---

## 💡 Solution

AI Document Generator automates documentation creation by:
- Parsing the uploaded codebase
- Understanding structure using AST
- Generating human-readable documentation using AI

📌 **Result:** Accurate, consistent documentation in minutes.

---

## 🧠 How It Works

1. User signs up or logs in (Email / Google OAuth)
2. Uploads a ZIP file **or** connects a GitHub repository
3. Backend extracts and parses code
4. AI analyzes structure and logic
5. Documentation is generated and displayed in the UI
6. User can view, copy, or reuse the docs

---

## ✨ Features

- 🔐 Authentication (JWT + Google OAuth)
- 📦 ZIP file upload support
- 🔗 GitHub repository integration
- 🧠 AI-generated documentation
- 📄 README & module summaries
- 🧩 Architecture overview
- 📊 Activity history
- 🌍 Public shareable documentation links
- 🎨 Clean, responsive UI

---

## 🖥️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router
- Framer Motion
- Mermaid.js
- Monaco Editor
- **Deployment:** Vercel

### Backend
- Node.js
- Express.js
- Multer (ZIP uploads)
- simple-git (GitHub integration)
- Babel / AST Parser
- OpenAI API
- MongoDB Atlas
- JWT Authentication
- Passport.js (Google OAuth)
- **Deployment:** Render

---

## 🗂️ Environment Variables

### Backend (`.env`)
```env
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend-url/api/auth/google/callback

FRONTEND_URL=https://your-frontend-url
OPENAI_API_KEY=your_openai_api_key
