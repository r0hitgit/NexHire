# NexHire 🚀 — Job Portal System

A full-stack job portal connecting top talent with great companies.

🌐 **Live:** [nexhire.me](https://nexhire.me)

---

## Tech Stack

### Backend
- Java 17
- Spring Boot 3
- Spring Security + JWT Authentication
- MySQL (Aiven)
- REST APIs
- Email OTP Verification (Brevo HTTP API)
- Async Email Processing

### Frontend
- React (Vite)
- Axios
- Responsive CSS with CSS Variables

### Deployment
- **Backend:** Render (Docker)
- **Frontend:** Netlify
- **Database:** Aiven MySQL
- **Email:** Brevo HTTP API
- **Domain:** nexhire.me (Namecheap)
- **Monitoring:** UptimeRobot

---

## Features

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Role Based Access (Candidate / Recruiter)
- ✅ Email OTP Verification on Registration
- ✅ Forgot Password with OTP Reset
- ✅ Welcome Email on Registration
- ✅ Post Jobs (Recruiter)
- ✅ Apply for Jobs (Candidate)
- ✅ Manage Applications & Status
- ✅ Recruiter Dashboard
- ✅ Candidate Dashboard
- ✅ Fully Responsive (Mobile + Desktop)
- ✅ Custom Domain (nexhire.me)
- ✅ Landing Page

---

## Getting Started (Local)

### Prerequisites
- Java 17
- Node.js
- Maven

### Backend
```bash
cd backend
# Add your environment variables in application.properties
./mvnw spring-boot:run
```
Runs on `http://localhost:8081`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

### Environment Variables (Backend)
| Variable | Description |
|----------|-------------|
| `BREVO_API_KEY` | Brevo HTTP API key for emails |
| `SPRING_DATASOURCE_URL` | Aiven MySQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Database password |

---

## Live Links

| Service | URL |
|---------|-----|
| 🌐 Frontend | [nexhire.me](https://nexhire.me) |
| 🔧 Backend | [job-portal-project-7tud.onrender.com](https://job-portal-project-7tud.onrender.com) |
| 💻 GitHub Repo | [github.com/r0hitgit/job-portal-project](https://github.com/r0hitgit/job-portal-project) |

---

## Author

**Rohit Verma**
- 💼 [LinkedIn](https://www.linkedin.com/in/r0hitin)
- 🐙 [GitHub](https://github.com/r0hitgit)
