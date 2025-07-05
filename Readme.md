# ‍⚖️ Online Judge

![Tech Stack](https://img.shields.io/badge/stack-React%20%2B%20Node.js%20%2B%20MongoDB-Informational)
![Status](https://img.shields.io/badge/status-In%20Development-yellow)

Online Judge is a full-stack web application built to simulate competitive programming platforms like LeetCode, Codeforces, and HackerRank. It enables users to view problems, write and submit code in multiple languages, and get real-time verdicts (e.g., Accepted, WA, TLE).

> ⚠️ This project is under development—stay tuned for new features and enhancements!

---

## 🚀 Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router + Monaco Editor + Framer Motion  
- **Backend:** Node.js + Express.js + MongoDB + Mongoose  
- **Compiler Service:** Node.js + Docker (G++, OpenJDK17, Python3)  
- **Authentication:** JSON Web Tokens (JWT)  
- **Media Storage:** Cloudinary (for profile pictures and assets)  
- **Code Execution:** Isolated Docker containers  

---

## ⚙️ Features

| Status | Feature                                 |
|:------:|------------------------------------------|
| ✅     | User registration & login               |
| ✅     | Problem listing & detailed views         |
| ✅     | Code submission in C++, Java, Python, JavaScript    |
| ✅     | Real-time verdicts (Accepted, WA, TLE) |
| ✅     | User profile & submission history       |
| ✅     | Docker-based isolated code execution    |
| ✅     | Admin panel for problem management      |
| 🔜     | Leaderboard & contest system            |

---

## 🗂️ Project Structure

```
OnlineJudge-main/
├── client/               # Frontend (React + Vite)
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   └── src/
├── server/               # Backend API (Express.js)
│   ├── Dockerfile
│   ├── index.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── validators/
├── compiler/             # Code execution service
│   ├── Dockerfile
│   ├── index.js
│   ├── generateAIReview.js
│   ├── generateFile.js
│   ├── runCode.js
│   └── submitCode.js
├── .gitignore
└── Readme.md             # Original project README
```

---

## 🛠️ Compiler Server (Code Execution Service)

The **compiler server** is a separate backend microservice responsible for securely compiling and executing user-submitted code.

- **How it works:**
    1. The main backend receives code submission from the user.
    2. It sends the code, input, and selected language to the compiler server via REST API.
    3. The compiler server launches a Docker container for the specified language, compiles and executes the code, and captures output/errors.
    4. It returns the verdict (Accepted, WA, TLE, etc.) and execution details back to the backend, which updates the user.

- **Tech Used:**  
    - Node.js / Express.js for the service logic  
    - Docker for isolated, secure code execution  
    - Supports: C++, Java, Python

- **Benefits:**  
    - Sandbox environment ensures user code can't affect the system  
    - Flexible multi-language support  
    - Easy to scale by running multiple containers in parallel

---

## 🧠 How It Works

1. User selects a problem  
2. Writes code in the built-in editor  
3. Submits → Backend calls the compiler server, which runs code in a Docker container  
4. Code is compiled and tested against hidden test cases  
5. Verdict (Accepted, WA, TLE, etc.) and output/errors are returned and displayed to user

---

## 🔧 Installation

### Prerequisites

- **Node.js & npm:** v18+  
- **Docker & Docker Compose:** v20+  
- **MongoDB:** connection URI  
- **Cloudinary:** account credentials for media storage  

### Setup Steps

1. **Clone the repository**  
   ```bash
   git clone https://github.com/Umesh-Verma07/OnlineJudge.git
   cd OnlineJudge
   ```

2. **Configure environment variables**  
   Create a `.env` file inside the `server/` directory:
   ```env
   PORT=8000
   MONGODB_URL=<your_mongodb_connection_string>
   CLOUDINARY_CLOUD_NAME=<your_cloud_name>
   CLOUDINARY_API_KEY=<your_api_key>
   CLOUDINARY_API_SECRET=<your_api_secret>
   ```

3. **Install dependencies**  
   ```bash
   # Backend
   cd server
   npm install

   # Compiler service
   cd ../compiler
   npm install

   # Frontend
   cd ../client
   npm install
   ```

---

## ▶️ Running Locally

Open three terminal windows/tabs:

```bash
# Backend
cd OnlineJudge/server
npm start

# Compiler Service
cd OnlineJudge/compiler
npm start

# Frontend
cd OnlineJudge/client
npm run dev
```

Frontend will be available at `http://localhost:5173`. API runs on port `8000`, and compiler service on `8080`.

---

## 🐳 Running with Docker

1. **Build Docker images**  
   ```bash
   docker build -t oj-client client/
   docker build -t oj-server server/
   docker build -t oj-compiler compiler/
   ```

2. **Run containers**  
   ```bash
   docker run -d -p 5173:5173 oj-client
   docker run -d -p 8000:8000 --env-file server/.env oj-server
   docker run -d -p 8080:8080 oj-compiler
   ```
---

## 📬 Contact

Made by **Umesh Kumar Verma** – feel free to open issues or contribute!

---
