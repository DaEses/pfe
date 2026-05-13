# Job Finder Portal

A comprehensive job search and recruitment platform featuring AI-powered HR interviews, job applications, and candidate management. The platform supports dual user flows: job seekers searching for positions and HR recruiters managing job postings and conducting interviews.

## Features

### For Job Seekers
- User registration and authentication
- Browse and search job postings
- Submit job applications
- Save favorite jobs for later
- View application status
- Complete profile management

### For HR/Recruiters
- Post and manage job listings
- Review incoming applications
- Conduct AI-powered chatbot interviews
- Manage candidate profiles
- Track interview progress and results

### AI & Chatbot Features
- **Chatbot HR Interviews**: Automated interview system using Ollama LLM integration
- **Audio Processing**: Whisper-based speech-to-text transcription
- **Resume Analysis**: PDF resume extraction and processing
- **Emotion Detection**: Computer vision-based candidate emotion tracking

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport.js
- **Password Hashing**: Bcrypt

### Frontend
- **Framework**: React 19.x
- **Build Tool**: Vite
- **Styling**: Bootstrap 5.x, CSS
- **Routing**: React Router 7.x
- **API Calls**: Fetch/Axios

### AI & ML
- **LLM**: Ollama (Llama 3.2-Vision)
- **Speech Recognition**: OpenAI Whisper
- **Vision**: MediaPipe Face Landmarker
- **Resume Processing**: PyMuPDF

## Project Structure

```
pfe/
├── plateform/jobfinderportal-master/
│   ├── job-finder-backend/              # NestJS backend application
│   │   ├── src/
│   │   │   ├── modules/                 # Feature modules
│   │   │   │   ├── auth/                # HR authentication
│   │   │   │   ├── job-seeker-auth/     # Job seeker authentication
│   │   │   │   ├── job-posting/         # Job listing management
│   │   │   │   ├── job-search/          # Job search functionality
│   │   │   │   ├── job-application/     # Application tracking
│   │   │   │   ├── saved-jobs/          # Saved jobs feature
│   │   │   │   ├── interview/           # Interview management
│   │   │   │   ├── chatbot-interview/   # AI chatbot interviews
│   │   │   │   └── job-seeker-profile/  # User profiles
│   │   │   ├── entities/                # TypeORM entities/models
│   │   │   ├── dtos/                    # Data transfer objects
│   │   │   ├── database/                # Database configuration
│   │   │   └── main.ts                  # Application entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── job-finder-frontend/             # React frontend application
│       ├── src/
│       │   ├── components/              # Reusable React components
│       │   ├── pages/                   # Page components
│       │   ├── context/                 # React context for state
│       │   ├── hooks/                   # Custom React hooks
│       │   ├── services/                # API services
│       │   ├── assets/                  # Images, fonts, etc.
│       │   ├── styles/                  # Global styles
│       │   ├── App.jsx                  # Root component
│       │   └── main.jsx                 # React DOM entry point
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
│
├── chatbot/                             # Python chatbot application
│   └── hr_interview.py                  # Ollama LLM interview script
│
└── emotiondetection/                    # Emotion detection module
```

## Prerequisites

- **Node.js** v18+ 
- **npm** or **yarn**
- **PostgreSQL** 13+ (for database)
- **Docker** (optional, for running Ollama)
- **Python** 3.8+ (for chatbot features)
- **Ollama** running locally (for AI interview features)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pfe
```

### 2. Backend Setup

```bash
cd plateform/jobfinderportal-master/job-finder-backend

# Install dependencies
npm install

# Configure environment variables (see Configuration section)
cp .env.example .env

# Run database migrations (if applicable)
npm run build
```

### 3. Frontend Setup

```bash
cd plateform/jobfinderportal-master/job-finder-frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### 4. Chatbot Setup (Optional)

```bash
cd chatbot

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Ensure Ollama is running on localhost:11434
```

## Configuration

### Backend Environment Variables (`.env`)

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=job_finder

# Application
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your_secret_key
JWT_EXPIRATION=3600

# Chatbot/AI
BACKEND_URL=http://localhost:3000
OLLAMA_URL=http://localhost:11434/api/chat
OLLAMA_MODEL=llama3.2-vision:11b
```

### Frontend Environment Variables (`.env`)

```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Job Finder Portal
```

### PostgreSQL Setup

```bash
# Create database
createdb job_finder

# Connect and set up user
psql job_finder
CREATE USER job_finder_user WITH PASSWORD 'password';
ALTER ROLE job_finder_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE job_finder TO job_finder_user;
```

## Running the Application

### Development Mode

**Backend:**
```bash
cd plateform/jobfinderportal-master/job-finder-backend
npm run start:dev
# Runs on http://localhost:3000
```

**Frontend:**
```bash
cd plateform/jobfinderportal-master/job-finder-frontend
npm run dev
# Runs on http://localhost:5173
```

**Chatbot (Optional):**
```bash
cd chatbot
python hr_interview.py
```

### Production Build

**Backend:**
```bash
cd plateform/jobfinderportal-master/job-finder-backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd plateform/jobfinderportal-master/job-finder-frontend
npm run build
# Build output in dist/ directory
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/hr-register` - Register HR user
- `POST /api/auth/hr-login` - Login HR user
- `POST /api/job-seeker-auth/register` - Register job seeker
- `POST /api/job-seeker-auth/login` - Login job seeker

### Job Posting Endpoints
- `GET /api/job-posting` - List all job postings
- `POST /api/job-posting` - Create new job posting (HR only)
- `GET /api/job-posting/:id` - Get job details
- `PUT /api/job-posting/:id` - Update job posting
- `DELETE /api/job-posting/:id` - Delete job posting

### Job Application Endpoints
- `POST /api/job-application` - Submit job application
- `GET /api/job-application` - Get user applications
- `GET /api/job-application/:id` - Get application details

### Interview Endpoints
- `POST /api/chatbot-interview/start` - Start AI interview
- `POST /api/chatbot-interview/submit-answer` - Submit interview answer
- `GET /api/chatbot-interview/:id` - Get interview results

### Job Search Endpoints
- `GET /api/job-search` - Search jobs with filters
- `GET /api/saved-jobs` - Get saved jobs list

## Development Commands

### Backend

```bash
# Build
npm run build

# Development with watch mode
npm run start:dev

# Linting
npm run lint

# Format code
npm run format

# Testing
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## Database Entities

The application uses the following main entities:

- **HRUser** - HR recruiter accounts
- **JobSeeker** - Job applicant accounts
- **JobPosting** - Job listings
- **JobApplication** - Applications submitted by job seekers
- **Application** - Internal application tracking (HR)
- **Interview** - Interview records
- **SavedJob** - Bookmarked jobs
- **ChatbotCandidate** - Candidate records for chatbot interviews
- **ChatbotInterview** - Interview session data
- **ChatbotQuestion** - Interview questions and responses

## Architecture

### Separation of Concerns
The backend follows a modular architecture with clear separation between:
- **Authentication Flows**: Separate modules for HR and Job Seeker authentication
- **Features**: Each feature (job posting, applications, etc.) is isolated in its module
- **Data Access**: TypeORM handles all database operations
- **API Contracts**: DTOs define input/output schemas

### Authentication
- JWT-based authentication with Passport.js
- Separate auth contexts for HR and job seekers
- Bcrypt password hashing for security

## Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Connection string format
postgresql://user:password@localhost:5432/job_finder
```

### Port Already in Use
```bash
# Backend (default 3000)
PORT=3001 npm run start:dev

# Frontend automatically uses next available port
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Ollama Connection Issues
- Ensure Ollama is running: `ollama serve`
- Check Ollama API: `curl http://localhost:11434/api/tags`
- Verify model is installed: `ollama pull llama3.2-vision:11b`

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## Code Style

- **Backend**: TypeScript with ESLint and Prettier
- **Frontend**: JavaScript/JSX with ESLint

Run formatters before committing:
```bash
npm run format
npm run lint
```

## License

UNLICENSED

## Support

For issues and questions, please refer to the project documentation or contact the development team.

---

**Last Updated**: 2026-05-12
