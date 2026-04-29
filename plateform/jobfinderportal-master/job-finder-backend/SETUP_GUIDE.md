# HR Platform Setup Guide

## Quick Start

### Step 1: Install Dependencies

```bash
cd job-finder-backend
npm install --legacy-peer-deps
```

### Step 2: Setup PostgreSQL Database

Make sure PostgreSQL is installed and running on your system.

#### On Linux/Mac:
```bash
# Create database
createdb hr_platform

# Optional: Create a dedicated user
createuser -P hr_user
psql -d hr_platform -c "GRANT ALL PRIVILEGES ON DATABASE hr_platform TO hr_user;"
```

#### On Windows:
Use pgAdmin or PostgreSQL installer to create a database named `hr_platform`

### Step 3: Configure Environment

Create a `.env` file in the `job-finder-backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=hr_platform
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
```

### Step 4: Run the Application

**Development mode (with hot reload):**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3000`

---

## Testing the API

### 1. Register a New HR Account

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@company.com",
    "password": "SecurePass123!",
    "companyName": "Tech Company"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "recruiter@company.com",
    "companyName": "Tech Company"
  }
}
```

Save the `accessToken` for subsequent requests.

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@company.com",
    "password": "SecurePass123!"
  }'
```

### 3. Create a Job Posting

```bash
curl -X POST http://localhost:3000/job-postings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Senior Developer",
    "description": "We are looking for an experienced JavaScript developer with 5+ years of experience",
    "position": "Senior Software Engineer",
    "location": "New York, NY",
    "requirements": "React, Node.js, TypeScript, PostgreSQL",
    "salary": 150000,
    "status": "active"
  }'
```

### 4. View Your Job Postings

```bash
curl -X GET http://localhost:3000/job-postings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Submit an Application (as a Job Seeker)

```bash
curl -X POST http://localhost:3000/applications/{jobPostingId} \
  -H "Content-Type: application/json" \
  -d '{
    "applicantName": "Jane Smith",
    "applicantEmail": "jane@example.com",
    "applicantPhone": "555-0123",
    "applicantResume": "Jane Smith\n✓ 6 years React experience\n✓ AWS certified\n✓ Strong TypeScript skills",
    "coverLetter": "I am very interested in this position and believe my experience aligns well with your needs."
  }'
```

### 6. View All Applicants for a Job Posting

```bash
curl -X GET http://localhost:3000/job-postings/{jobPostingId}/applicants \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7. Update Application Status

```bash
curl -X PATCH http://localhost:3000/applications/{applicationId}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "shortlisted",
    "rating": 8,
    "notes": "Strong candidate, good communication skills"
  }'
```

### 8. Schedule an Interview

```bash
curl -X POST http://localhost:3000/interviews/{applicationId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "type": "Video",
    "scheduledDateTime": "2026-04-15T14:00:00Z",
    "duration": 60,
    "meetingLink": "https://zoom.us/j/123456789"
  }'
```

### 9. View All Scheduled Interviews

```bash
curl -X GET http://localhost:3000/interviews \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 10. Update Interview Status

```bash
curl -X PATCH http://localhost:3000/interviews/{interviewId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "completed",
    "feedback": "Excellent communication, strong technical knowledge",
    "score": 9
  }'
```

---

## Using Postman or Thunder Client

Instead of curl, you can use:

1. **Postman** - Import the API collection or create requests manually
2. **Thunder Client** (VSCode extension) - Similar to Postman, lighter weight
3. **Insomnia** - Another great API testing tool

Here's a Postman collection export template:

```json
{
  "info": {
    "name": "HR Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"recruiter@company.com\",\"password\":\"SecurePass123!\",\"companyName\":\"Tech Company\"}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## Database Tables Created

The following tables will be automatically created:

1. **hr_users** - HR/Recruiter accounts
2. **job_postings** - Job listings
3. **applications** - Job applications from candidates
4. **interviews** - Scheduled interviews

---

## Troubleshooting

### PostgreSQL Connection Error
Make sure PostgreSQL is running:

```bash
# On Mac (using Homebrew)
brew services start postgresql

# On Linux
sudo systemctl start postgresql
```

### Port Already in Use
Change the port in `.env`:
```
PORT=3001
```

### Database Not Found
Create the database:
```bash
psql -U postgres -c "CREATE DATABASE hr_platform;"
```

### Dependency Issues
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## Next Steps

1. **Setup Frontend** - Create a React/Vue/Angular frontend to interact with these APIs
2. **Email Notifications** - Add email notifications when applications are received or interviews are scheduled
3. **File Uploads** - Allow candidates to upload PDF resumes instead of plain text
4. **Analytics** - Add recruitment funnel analytics and reporting
5. **Messaging** - Add in-app messaging between HR and applicants

---

## API Documentation

For complete API documentation, see: `HR_PLATFORM_API.md`

---

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify your `.env` file is configured correctly
3. Make sure PostgreSQL is running
4. Check that the database exists
5. Review the HR_PLATFORM_API.md for endpoint specifications
