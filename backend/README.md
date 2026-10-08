# SmartHRMS Backend API

Production-ready, modular REST API backend for the **SmartHRMS** Enterprise HR Management System. Built with Node.js, Express, MongoDB (Mongoose), JWT authentication, and Google Gemini AI.

---

## Architecture Overview

The backend follows a clean, modular Model-Controller-Service-Route architecture:

```
backend/
├── src/
│   ├── app.js                   # Express application setup, CORS, middleware, route mounts
│   ├── server.js                # Server entry point, database connection & app.listen()
│   ├── config/
│   │   ├── env.js               # Centralized typed environment configuration
│   │   ├── database.js          # MongoDB connection manager, DNS IPv4 resolution, auto-seed
│   │   └── seedData.js          # Default demo seed dataset for initial bootstrapping
│   ├── models/
│   │   ├── Employee.js          # Employee schema and model
│   │   ├── Candidate.js         # Candidate job applications and evaluations
│   │   ├── Job.js               # Job postings schema
│   │   ├── Attendance.js        # Daily attendance check-in / check-out
│   │   ├── Leave.js             # Leave requests and approvals
│   │   ├── Policy.js            # Company HR policies
│   │   ├── JobSeeker.js         # Public candidate portal accounts
│   │   ├── Setting.js           # Dynamic application settings (e.g. Gemini key)
│   │   └── index.js             # Barrel export for all models
│   ├── controllers/
│   │   ├── auth.controller.js       # Employee & candidate authentication
│   │   ├── employee.controller.js   # Employee CRUD, profiles, status
│   │   ├── candidate.controller.js  # Candidate portal & recruiter screening
│   │   ├── job.controller.js        # Job postings CRUD
│   │   ├── attendance.controller.js # Attendance check-in / check-out
│   │   ├── leave.controller.js      # Leave requests & approval workflows
│   │   ├── ai.controller.js         # AI resume screening, voice Q&A, chatbot
│   │   ├── policy.controller.js     # HR policy management
│   │   └── settings.controller.js   # System settings & DB health
│   ├── routes/
│   │   ├── auth.routes.js           # /api/auth routes
│   │   ├── employee.routes.js       # /api/employees routes
│   │   ├── candidate.routes.js      # /api/candidate & /api/candidates routes
│   │   ├── job.routes.js            # /api/jobs routes
│   │   ├── attendance.routes.js     # /api/attendance routes
│   │   ├── leave.routes.js          # /api/leaves routes
│   │   ├── ai.routes.js             # /api/ai routes
│   │   ├── policy.routes.js         # /api/policies routes
│   │   └── settings.routes.js       # /api/settings routes
│   ├── middleware/
│   │   ├── auth.middleware.js       # Bearer JWT token verification
│   │   ├── role.middleware.js       # Role-based access control (RBAC)
│   │   ├── upload.middleware.js     # Multer memory storage for PDF parsing
│   │   └── error.middleware.js      # Centralized error & 404 handlers
│   ├── services/
│   │   ├── auth.service.js          # JWT signing, user & candidate credential validation
│   │   ├── resume.service.js        # PDF text parsing & extraction
│   │   └── gemini.service.js        # Gemini AI ATS screening, voice interview & HR bot
│   └── utils/
│       └── polyfills.js             # Serverless environment DOM/canvas polyfills for pdfjs
├── .env.example
├── .gitignore
├── package.json
├── server.js                    # Root server proxy (for Vercel serverless compatibility)
└── vercel.json                  # Vercel serverless configuration
```

---

## Environment Variables

Create a `.env` file in `backend/` based on `.env.example`:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Local server port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | Required |
| `JWT_SECRET` | Secret key for signing and verifying JWT tokens | Required |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Optional (offline simulators active if unset) |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |

---

## API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Employee & Candidate login with JWT issue |
| `POST` | `/api/auth/register` | Public | Candidate registration alias |

### Candidate Portal (`/api/candidate`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/candidate/auth/register` | Public | Register new candidate account |
| `POST` | `/api/candidate/auth/login` | Public | Candidate login |
| `GET` | `/api/candidate/profile` | Candidate | Get logged-in candidate profile |
| `PUT` | `/api/candidate/profile` | Candidate | Update candidate profile details |
| `GET` | `/api/candidate/applications` | Candidate | Get candidate's submitted job applications |
| `POST` | `/api/candidate/profile/resume` | Candidate | Upload and parse PDF resume to profile |
| `POST` | `/api/candidate/apply` | Candidate | Apply for a job position with resume |

### Recruiter & Candidate Management (`/api/candidates`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/candidates` | HR / Admin | List all candidates across all positions |
| `POST` | `/api/candidates` | Public | Add candidate application manually |
| `POST` | `/api/candidates/parse-resume` | HR / Admin | Upload and parse any resume PDF to text |
| `POST` | `/api/candidates/:id/screen` | HR / Admin | Run AI ATS match evaluation against job requirements |
| `PUT` | `/api/candidates/:id/status` | HR / Admin | Update status & schedule interview rounds |
| `PUT` | `/api/candidates/:id/evaluation` | HR / Admin | Save AI screening evaluation |
| `PUT` | `/api/candidates/:id/interview-report` | HR / Admin / Candidate | Save AI voice interview score & feedback |

### Employee Management (`/api/employees`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/employees/me` | Authenticated | Retrieve current user's employee profile |
| `PUT` | `/api/employees/me/profile` | Authenticated | Update current user's profile details |
| `GET` | `/api/employees` | Admin / Senior Manager | List all company employees |
| `POST` | `/api/employees` | Admin | Create a new employee |
| `PUT` | `/api/employees/:id/toggle-status` | Admin | Activate or deactivate employee |
| `PUT` | `/api/employees/:id` | Admin | Update employee fields |

### Attendance (`/api/attendance`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/attendance` | Authenticated | Get attendance (own records for Employee, all for others) |
| `POST` | `/api/attendance/check-in` | Authenticated | Clock in for the day (on-time before 9:15 AM) |
| `POST` | `/api/attendance/check-out` | Authenticated | Clock out and calculate worked hours |

### Leave Management (`/api/leaves`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/leaves` | Authenticated | List leave requests (own for Employee, all for others) |
| `POST` | `/api/leaves` | Authenticated | Submit a new leave request |
| `PUT` | `/api/leaves/:id/approve` | Admin / Senior Manager | Approve leave and deduct employee balance |
| `PUT` | `/api/leaves/:id/reject` | Admin / Senior Manager | Reject leave request |

### Recruitment & Jobs (`/api/jobs`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | List all open job postings |
| `POST` | `/api/jobs` | Admin / HR Recruiter | Create a new job opening |
| `PUT` | `/api/jobs/:id` | Admin / HR Recruiter | Edit job posting details |
| `DELETE` | `/api/jobs/:id` | Admin / HR Recruiter | Delete job posting and associated candidates |

### Policies (`/api/policies`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/policies` | Authenticated | List company HR policies |
| `PUT` | `/api/policies/:title` | Admin | Update HR policy content |

### AI Services (`/api/ai`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/screen` | Admin / HR Recruiter | Live ATS match evaluation of resume vs JD |
| `POST` | `/api/ai/interview/question` | Admin / Recruiter / Candidate | Dynamic voice interview question generator |
| `POST` | `/api/ai/interview/evaluate` | Admin / Recruiter / Candidate | Evaluate full interview transcript & generate scorecard |
| `POST` | `/api/ai/chatbot` | Authenticated | Query AI HR Assistant with company context |

### Settings & System Health (`/api/settings` & root)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | API health, MongoDB connection status, timestamp |
| `GET` | `/api` | Public | Welcome status message |
| `GET` | `/api/db-status` | Public | Detailed MongoDB connection diagnostics |
| `GET` | `/api/settings/has-key` | Public | Check if Gemini API key is configured |
| `POST` | `/api/settings/key` | Admin | Save/update server-side Gemini API key |

---

## Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and supply your MONGODB_URI, JWT_SECRET, and GEMINI_API_KEY
```

### 3. Run Locally
```bash
# Development (with hot-reload via nodemon)
npm run dev

# Production
npm start
```

### 4. Vercel Deployment
The repository includes `vercel.json` and a root `server.js` export preconfigured for zero-configuration deployment to Vercel Serverless Functions.
Ensure `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY` are defined in your Vercel Project Environment Variables.
