# Startup Network Finder - NextWork

A full-stack application connecting founders with investors/mentors using AI-powered search and a credit management system.

### Deployed URLs

- Frontend: https://startupnetworkfinderfrontend.onrender.com

- Backend: https://startupnetworkfinderbackend.onrender.com

![](./client/public/snf.gif)

## 🔍 About
This platform allows startup founders to:
- Find relevant investors/mentors by describing their needs in natural language
- Use **Google Gemini AI** to analyze queries and match with database entries
- Manage usage via a credit system (5 free credits, recharge via email)

---

## 🚀 Features

### User Authentication:
- Secure login and logout functionality.
- **Google OAuth Login**: Secure authentication using Gmail accounts

### Matchmaking:
- **AI-Powered Search**: Gemini API analyzes user queries to find matches
- **Credit System**:
  - 5 initial credits, 1 credit per search
  - Auto-email when credits are exhausted
  - One-time recharge via email

### Notifications:
- **Email Integration**:
  - Automatic recharge notifications
  - Recharge request processing via Gmail API

### CRON-Jobs
- Use of CRON jobs to scheduling of sending of mails.

### Error Handling:
  - Clear messages for credit exhaustion
  - Recharge attempt restrictions

---

## 💻 Tech Stack
**Frontend**  
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)

**Backend**  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express)

**Database**  
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb)

**APIs & Services**  
![Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat&logo=google)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=flat&logo=google)
![Nodemailer](https://img.shields.io/badge/Nodemailer-339933?style=flat)

**Deployment**
- Render

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js ≥16.x
- MongoDB Atlas account
- Google Cloud credentials (OAuth & Gemini API)
- Gmail account for email service

### Backend Setup
1. Clone repository
   ```bash
   git clone https://github.com/Sachins0/StartupNetworkFinder.git
   cd server
   ```
2. Install dependencies:
```
npm install
```

3. Configure environment variables:

- Create a .env file in the root directory with the following:
```
PORT = 5000
MONGODB_URI = 
JWT_SECRET = 
GEMINI_API_KEY = 
MAIL_USER =
MAIL_PASSWORD = 
RECHARGE_EMAIL =
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 
GOOGLE_REDIRECT_URI = 
GMAIL_REFRESH_TOKEN = 
CORS = 'http://localhost:3000'
```
5. Start the server:
```
npm run dev
```

- Backend will run at http://localhost:5000.

### Frontend Setup

1. Navigate to frontend folder:
```
cd client
```

2. Install dependencies:
```
npm install
```

3. Create a .env file in the root directory with the following:
```
REACT_APP_API_URL = http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID = 
```

4. Start the development server:
```
npm start
```

- Frontend will run at http://localhost:3000.

