# HR Recruitment Platform Backend

A comprehensive NestJS-based HR platform that enables recruiters to manage job postings, track applications, and schedule interviews.

## 🎯 Features

### Job Posting Management
- ✅ Create, read, update, and delete job postings
- ✅ Track applicant count per job
- ✅ Manage job status (active, draft, closed)
- ✅ Set salary and requirements

### Application Management
- ✅ Receive and manage job applications
- ✅ Update application status (pending, reviewed, shortlisted, rejected, hired)
- ✅ Rate applicants (1-10 scale)
- ✅ Add internal notes to applications
- ✅ Prevent duplicate applications

### Interview Scheduling
- ✅ Schedule interviews for shortlisted candidates
- ✅ Support multiple interview types (phone, video, in-person)
- ✅ Store meeting links for virtual interviews
- ✅ Record interview feedback and scores
- ✅ Track interview status

### Security
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based authorization
- ✅ Data isolation per HR user

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL v12+
- npm

### Installation

1. **Clone and navigate to the backend:**
```bash
cd job-finder-backend
```

2. **Install dependencies:**
```bash
npm install --legacy-peer-deps
```

3. **Setup environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Start the server:**
```bash
npm run start:dev
```

The API will be running at `http://localhost:3000`

---

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed setup instructions with examples
- **[API Documentation](./HR_PLATFORM_API.md)** - Complete endpoint reference with request/response examples

---

## 🏗️ Project Structure

```
src/
├── entities/                 # Database entities
│   ├── hr-user.entity.ts        # HR user/recruiter accounts
│   ├── job-posting.entity.ts    # Job postings
│   ├── application.entity.ts    # Job applications
│   └── interview.entity.ts      # Interview schedules
│
├── dtos/                    # Data Transfer Objects
│   ├── job-posting.dto.ts      # Job posting validation
│   ├── application.dto.ts      # Application validation
│   └── interview.dto.ts        # Interview validation
│
├── modules/                 # Feature modules
│   ├── auth/                    # Authentication & authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── hr-user.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── auth.module.ts
│   │
│   ├── job-posting/             # Job posting management
│   │   ├── job-posting.controller.ts
│   │   ├── job-posting.service.ts
│   │   └── job-posting.module.ts
│   │
│   ├── application/             # Application management
│   │   ├── application.controller.ts
│   │   ├── application.service.ts
│   │   └── application.module.ts
│   │
│   └── interview/               # Interview scheduling
│       ├── interview.controller.ts
│       ├── interview.service.ts
│       └── interview.module.ts
│
├── database/                # Database configuration
│   └── database.module.ts
│
├── app.module.ts           # Root module
└── main.ts                 # Application entry point
```

---

## 🔌 API Endpoints Overview

### Authentication
- `POST /auth/register` - Create new HR account
- `POST /auth/login` - Login and get JWT token

### Job Postings
- `POST /job-postings` - Create job posting
- `GET /job-postings` - Get all job postings
- `GET /job-postings/:id` - Get job posting details
- `PATCH /job-postings/:id` - Update job posting
- `DELETE /job-postings/:id` - Delete job posting
- `GET /job-postings/:id/applicants` - Get applicants for job

### Applications
- `POST /applications/:jobPostingId` - Submit application
- `GET /applications/job/:jobPostingId` - Get job applications
- `GET /applications/:id` - Get application details
- `PATCH /applications/:id/status` - Update application status
- `DELETE /applications/:id` - Delete application

### Interviews
- `POST /interviews/:applicationId` - Schedule interview
- `GET /interviews` - Get all scheduled interviews
- `GET /interviews/upcoming` - Get upcoming interviews
- `GET /interviews/application/:applicationId` - Get application interviews
- `PATCH /interviews/:id` - Update interview
- `DELETE /interviews/:id` - Cancel interview

See [HR_PLATFORM_API.md](./HR_PLATFORM_API.md) for detailed documentation.

---

## 🗄️ Database Schema

### hr_users
```
- id (UUID)
- email (VARCHAR, unique)
- password (VARCHAR)
- companyName (VARCHAR)
- companyDescription (TEXT, nullable)
- phone (VARCHAR, nullable)
- createdAt (TIMESTAMP)
```

### job_postings
```
- id (UUID)
- title (VARCHAR)
- description (TEXT)
- position (VARCHAR)
- location (VARCHAR)
- requirements (TEXT, nullable)
- salary (DECIMAL, nullable)
- status (ENUM: active, draft, closed)
- applicantCount (INTEGER, default: 0)
- postedById (UUID, FK)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### applications
```
- id (UUID)
- applicantName (VARCHAR)
- applicantEmail (VARCHAR, unique)
- applicantPhone (VARCHAR)
- applicantResume (TEXT)
- coverLetter (TEXT, nullable)
- status (ENUM: pending, reviewed, shortlisted, rejected, hired)
- rating (INTEGER, nullable)
- notes (TEXT, nullable)
- jobPostingId (UUID, FK)
- appliedAt (TIMESTAMP)
```

### interviews
```
- id (UUID)
- type (VARCHAR)
- scheduledDateTime (TIMESTAMP)
- duration (INTEGER, nullable)
- status (ENUM: scheduled, completed, cancelled, no-show)
- feedback (TEXT, nullable)
- score (INTEGER, nullable)
- meetingLink (VARCHAR, nullable)
- applicationId (UUID, FK)
- approverId (UUID, FK)
- createdAt (TIMESTAMP)
```

---

## 🔐 Authentication

The platform uses JWT (JSON Web Tokens) for authentication:

1. **Register** - Create HR account
2. **Login** - Get access token
3. **Requests** - Include token in Authorization header:
   ```
   Authorization: Bearer <your_access_token>
   ```

Tokens expire after 24 hours.

---

## ⚙️ Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=hr_platform

# JWT
JWT_SECRET=your-secret-key-here

# Server
PORT=3000
NODE_ENV=development  # or 'production'
```

---

## 📦 Technologies Used

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport.js
- **Validation**: class-validator
- **Language**: TypeScript
- **Package Manager**: npm

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 🔨 Build & Deploy

### Development
```bash
npm run start:dev
```

### Production Build
```bash
npm run build
npm run start:prod
```

---

## 📋 Available Scripts

```bash
npm run start        # Production start
npm run start:dev    # Development with hot reload
npm run start:debug  # Debug mode
npm run build        # Build for production
npm run format       # Format code with Prettier
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Tests in watch mode
npm run test:cov     # Tests with coverage
npm run test:e2e     # E2E tests
```

---

## 🚧 Roadmap

- [ ] Email notifications for new applications
- [ ] Email notifications for scheduled interviews
- [ ] Resume file uploads (PDF/DOC)
- [ ] Resume parsing and skill extraction
- [ ] Recruitment analytics dashboard
- [ ] In-app messaging system
- [ ] Candidate profile ranking
- [ ] Job recommendation engine
- [ ] Bulk import/export of job postings
- [ ] Multi-language support

---

## 📄 License

This project is licensed under the UNLICENSED license.

---

## 📞 Support

For issues and questions:
1. Check the [Setup Guide](./SETUP_GUIDE.md)
2. Review the [API Documentation](./HR_PLATFORM_API.md)
3. Check application logs
4. Verify PostgreSQL connection

---

## 🎓 Learning Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Authentication](https://jwt.io/)

---

**Built with ❤️ using NestJS**
