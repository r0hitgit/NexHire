# NexHire — Job Portal System

A full-stack job portal connecting top talent with great companies.

**Live:** [nexhire.me](https://nexhire.me)

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
- Cloudinary (Resume Storage)

### Frontend
- React (Vite)
- Axios
- Responsive CSS with CSS Variables

### Deployment
- **Backend:** Render (Docker)
- **Frontend:** Netlify
- **Database:** Aiven MySQL
- **Email:** Brevo HTTP API
- **File Storage:** Cloudinary
- **Domain:** nexhire.me (Namecheap)
- **Monitoring:** UptimeRobot

---

## Features

### Authentication
- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Role Based Access (Candidate / Recruiter)
- ✅ Email OTP Verification on Registration
- ✅ Forgot Password with OTP Reset
- ✅ Welcome Email on Registration

### Candidate
- ✅ Browse & Search Jobs
- ✅ Job Detail Page with Full Job Info
- ✅ Apply for Jobs with Resume Upload (PDF)
- ✅ Withdraw Application
- ✅ Track Application Status in Real Time
- ✅ Interview Schedule Notifications (Email)
- ✅ Candidate Dashboard

### Recruiter
- ✅ Post, Edit & Delete Jobs
- ✅ View All Applicants per Job
- ✅ View Candidate Resume (PDF)
- ✅ Shortlist / Reject Candidates
- ✅ Schedule Interview (Email Notification to Candidate)
- ✅ Contact Candidate via Email
- ✅ Recruiter Dashboard

### General
- ✅ Fully Responsive (Mobile + Desktop)
- ✅ Custom Domain (nexhire.me)
- ✅ Landing Page
- ✅ UptimeRobot Monitoring (Prevents Render Cold Starts)

---

## Getting Started (Local)

### Prerequisites
- Java 17
- Node.js
- Maven

### Environment Variables

Create the following environment variables before running locally:

| Variable | Description |
|---|---|
| `SPRING_DATASOURCE_URL` | MySQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | MySQL username |
| `SPRING_DATASOURCE_PASSWORD` | MySQL password |
| `BREVO_API_KEY` | Brevo HTTP API key for emails |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Backend
```bash
cd backend
# Set environment variables in application.properties or as system env vars
mvn spring-boot:run -DskipTests
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure


job-portal-project/
├── backend/                  # Spring Boot backend
│   ├── src/main/java/com/rohit/jobportal/
│   │   ├── config/           # Security & Cloudinary config
│   │   ├── controller/       # REST controllers
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Spring Data repositories
│   │   ├── service/          # Business logic
│   │   └── security/         # JWT filter & util
│   └── src/main/resources/
│       └── application.properties
└── frontend/                 # React + Vite frontend
└── src/
├── api/              # Axios API calls
├── components/       # Navbar, Footer
└── pages/            # All page components

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login |
| POST | `/api/users/verify-otp` | Verify email OTP |
| POST | `/api/users/forgot-password` | Request password reset OTP |
| POST | `/api/users/reset-password` | Reset password |

### Jobs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/{id}` | Get job by ID |
| GET | `/api/jobs/my-jobs` | Get recruiter's jobs |
| POST | `/api/jobs` | Create job (Recruiter) |
| PUT | `/api/jobs/{id}` | Edit job (Recruiter) |
| DELETE | `/api/jobs/{id}` | Delete job (Recruiter) |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications/apply/{jobId}` | Apply for job with resume |
| GET | `/api/applications/my` | Get my applications (Candidate) |
| GET | `/api/applications/job/{jobId}` | Get applicants for job (Recruiter) |
| PUT | `/api/applications/{id}/status` | Update status (Recruiter) |
| POST | `/api/applications/{id}/schedule-interview` | Schedule interview (Recruiter) |
| POST | `/api/applications/{id}/contact` | Contact candidate (Recruiter) |
| DELETE | `/api/applications/{id}` | Withdraw application (Candidate) |

---

## Screenshots

> Coming soon

---

## Author

**Rohit Verma**
- GitHub: [@r0hitgit](https://github.com/r0hitgit)
- LinkedIn: [r0hitin](https://linkedin.com/in/r0hitin)
- Live: [nexhire.me](https://nexhire.me)
