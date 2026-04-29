# HR Platform API Documentation

## Overview
This is a comprehensive HR platform that allows recruiters/HR managers to create job postings, manage applicants, and schedule interviews.

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)
- npm

### Installation

1. Navigate to the backend directory:
```bash
cd job-finder-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update environment variables with your database credentials

5. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

---

## Authentication Endpoints

### Register HR User
**POST** `/auth/register`

Create a new HR account.

**Request Body:**
```json
{
  "email": "hr@company.com",
  "password": "securePassword123",
  "companyName": "Acme Corp"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "hr@company.com",
    "companyName": "Acme Corp"
  }
}
```

---

### Login
**POST** `/auth/login`

Login to get JWT token.

**Request Body:**
```json
{
  "email": "hr@company.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "hr@company.com",
    "companyName": "Acme Corp"
  }
}
```

---

## Job Posting Endpoints

### Create Job Posting
**POST** `/job-postings`

Create a new job posting.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "title": "Senior Developer",
  "description": "We are looking for an experienced developer...",
  "position": "Software Engineer",
  "location": "New York, NY",
  "requirements": "5+ years experience with React",
  "salary": 120000,
  "status": "active"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Senior Developer",
  "description": "We are looking for an experienced developer...",
  "position": "Software Engineer",
  "location": "New York, NY",
  "requirements": "5+ years experience with React",
  "salary": 120000,
  "status": "active",
  "applicantCount": 0,
  "createdAt": "2026-03-30T12:00:00Z",
  "updatedAt": "2026-03-30T12:00:00Z"
}
```

---

### Get All Job Postings
**GET** `/job-postings`

Get all job postings created by the authenticated HR user.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Senior Developer",
    "position": "Software Engineer",
    "location": "New York, NY",
    "applicantCount": 5,
    "createdAt": "2026-03-30T12:00:00Z"
  }
]
```

---

### Get Job Posting Details
**GET** `/job-postings/:id`

Get detailed information about a specific job posting including applications.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Senior Developer",
  "description": "We are looking for an experienced developer...",
  "position": "Software Engineer",
  "location": "New York, NY",
  "requirements": "5+ years experience with React",
  "salary": 120000,
  "status": "active",
  "applicantCount": 5,
  "applications": [
    {
      "id": "uuid",
      "applicantName": "John Doe",
      "applicantEmail": "john@example.com",
      "status": "pending",
      "appliedAt": "2026-03-28T10:00:00Z"
    }
  ]
}
```

---

### Update Job Posting
**PATCH** `/job-postings/:id`

Update job posting details.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "title": "Senior React Developer",
  "salary": 130000,
  "status": "active"
}
```

---

### Delete Job Posting
**DELETE** `/job-postings/:id`

Delete a job posting.

**Headers:**
```
Authorization: Bearer <accessToken>
```

---

### Get Job Applicants
**GET** `/job-postings/:id/applicants`

Get all applicants for a specific job posting.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "applicantName": "John Doe",
    "applicantEmail": "john@example.com",
    "applicantPhone": "555-1234",
    "status": "pending",
    "rating": null,
    "appliedAt": "2026-03-28T10:00:00Z"
  }
]
```

---

## Application Endpoints

### Submit Application
**POST** `/applications/:jobPostingId`

Submit an application for a job posting (public endpoint, no auth required).

**Request Body:**
```json
{
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com",
  "applicantPhone": "555-1234",
  "applicantResume": "John Doe\n✓ 5+ years React experience\n✓ AWS certified",
  "coverLetter": "I am very interested in this position..."
}
```

**Response:**
```json
{
  "id": "uuid",
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com",
  "applicantPhone": "555-1234",
  "status": "pending",
  "appliedAt": "2026-03-30T12:00:00Z"
}
```

---

### Get Applications for Job
**GET** `/applications/job/:jobPostingId`

Get all applications for a specific job posting.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "applicantName": "John Doe",
    "applicantEmail": "john@example.com",
    "applicantPhone": "555-1234",
    "status": "pending",
    "rating": null,
    "notes": null,
    "appliedAt": "2026-03-28T10:00:00Z"
  }
]
```

---

### Get Application Details
**GET** `/applications/:id`

Get detailed information about a specific application.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "id": "uuid",
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com",
  "applicantPhone": "555-1234",
  "applicantResume": "John Doe\n✓ 5+ years React experience\n✓ AWS certified",
  "coverLetter": "I am very interested in this position...",
  "status": "pending",
  "rating": null,
  "notes": null,
  "appliedAt": "2026-03-28T10:00:00Z",
  "interviews": []
}
```

---

### Update Application Status
**PATCH** `/applications/:id/status`

Update the status of an application (e.g., reviewed, shortlisted, rejected, hired).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "status": "shortlisted",
  "rating": 8,
  "notes": "Great technical skills, strong communication"
}
```

**Response:**
```json
{
  "id": "uuid",
  "applicantName": "John Doe",
  "status": "shortlisted",
  "rating": 8,
  "notes": "Great technical skills, strong communication"
}
```

---

### Delete Application
**DELETE** `/applications/:id`

Delete an application.

**Headers:**
```
Authorization: Bearer <accessToken>
```

---

## Interview Endpoints

### Schedule Interview
**POST** `/interviews/:applicationId`

Schedule an interview for an application.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "type": "Video",
  "scheduledDateTime": "2026-04-15T10:00:00Z",
  "duration": 60,
  "meetingLink": "https://zoom.us/meeting/123456"
}
```

**Response:**
```json
{
  "id": "uuid",
  "type": "Video",
  "scheduledDateTime": "2026-04-15T10:00:00Z",
  "duration": 60,
  "status": "scheduled",
  "meetingLink": "https://zoom.us/meeting/123456",
  "feedback": null,
  "score": null,
  "createdAt": "2026-03-30T12:00:00Z"
}
```

---

### Get All Scheduled Interviews
**GET** `/interviews`

Get all scheduled interviews for the authenticated HR user.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "Video",
    "status": "scheduled",
    "scheduledDateTime": "2026-04-15T10:00:00Z",
    "duration": 60,
    "application": {
      "id": "uuid",
      "applicantName": "John Doe",
      "applicantEmail": "john@example.com"
    },
    "jobPosting": {
      "id": "uuid",
      "title": "Senior Developer"
    }
  }
]
```

---

### Get Upcoming Interviews
**GET** `/interviews/upcoming`

Get all upcoming interviews.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "Video",
    "status": "scheduled",
    "scheduledDateTime": "2026-04-15T10:00:00Z",
    "application": {
      "applicantName": "John Doe"
    }
  }
]
```

---

### Get Interviews for Application
**GET** `/interviews/application/:applicationId`

Get all interviews scheduled for a specific application.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "Video",
    "status": "scheduled",
    "scheduledDateTime": "2026-04-15T10:00:00Z",
    "duration": 60,
    "feedback": null
  }
]
```

---

### Update Interview
**PATCH** `/interviews/:id`

Update interview details (status, feedback, score).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "status": "completed",
  "feedback": "Great candidate, strong technical knowledge",
  "score": 9
}
```

---

### Delete Interview
**DELETE** `/interviews/:id`

Delete/cancel an interview.

**Headers:**
```
Authorization: Bearer <accessToken>
```

---

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Job posting is not active or does not exist",
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Job posting with ID uuid not found",
  "error": "Not Found"
}
```

---

## Database Setup

The platform uses PostgreSQL. Make sure to:

1. Create a database:
```sql
CREATE DATABASE hr_platform;
```

2. Set environment variables:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=hr_platform
```

3. On first run, TypeORM will automatically create all tables based on the entities (synchronize: true in development)

---

## Features

✅ **Job Posting Management**
- Create, update, and delete job postings
- Track applicant count
- Set job status (active, draft, closed)

✅ **Application Management**
- Receive and manage applications
- Update application status
- Rate applications
- Add notes to applications

✅ **Interview Scheduling**
- Schedule interviews for applicants
- Support for different interview types (video, phone, in-person)
- Store meeting links
- Record interview feedback and scores
- Track interview status

✅ **Security**
- JWT-based authentication
- Password hashing with bcrypt
- Authorization checks (HR users can only see their own data)

---

## Environment Variables

Create a `.env` file with:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=hr_platform
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

---

## Project Structure

```
src/
├── entities/           # Database entities
│   ├── hr-user.entity.ts
│   ├── job-posting.entity.ts
│   ├── application.entity.ts
│   └── interview.entity.ts
├── dtos/              # Data Transfer Objects
│   ├── job-posting.dto.ts
│   ├── application.dto.ts
│   └── interview.dto.ts
├── modules/           # Feature modules
│   ├── auth/          # Authentication module
│   ├── job-posting/   # Job posting module
│   ├── application/   # Application module
│   └── interview/     # Interview scheduling module
├── app.module.ts      # Root module
└── main.ts           # Entry point
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are UUIDs
- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- The platform includes CORS support for frontend integration
