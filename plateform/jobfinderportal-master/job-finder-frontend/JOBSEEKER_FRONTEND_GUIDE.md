# Job Seeker Frontend - Implementation Summary

This document outlines the frontend flow for job seekers.

## Quick Start

The job seeker platform includes:
1. **Register** - Create a new job seeker account
2. **Job Search** - Browse and filter available jobs
3. **Job Details** - View full job information and apply
4. **My Applications** - Track your submitted applications
5. **Saved Jobs** - Bookmark jobs for later
6. **Profile** - Manage your experience, education, and resume

## API Integration

All pages use the following endpoints:

```javascript
// Auth
POST /auth/job-seeker/register
POST /auth/job-seeker/login

// Jobs (public)
GET /jobs
GET /jobs?location=&minSalary=&maxSalary=
GET /jobs/:id

// Applications (needs JWT token from register/login)
POST /job-applications
GET /job-applications
DELETE /job-applications/:id

// Saved Jobs
POST /saved-jobs/:jobPostingId
GET /saved-jobs
DELETE /saved-jobs/:jobPostingId

// Profile
GET /job-seeker/profile
PATCH /job-seeker/profile
POST /job-seeker/work-experience
DELETE /job-seeker/work-experience/:id
POST /job-seeker/education
DELETE /job-seeker/education/:id
```

## Key Implementation Notes

1. **Authentication Flow:**
   - Store token in localStorage with key 'jobSeekerToken'
   - Use same JWT pattern as HR platform
   - All protected endpoints require Bearer token

2. **Component Structure:**
   - Functional React components with hooks
   - useState for local state
   - localStorage for persistence
   - Fetch API for HTTP requests

3. **Styling:**
   - Use same CSS variables from main index.css
   - Follow same responsive breakpoints (768px, 1024px)
   - Match design patterns from HR platform

4. **Token Storage:**
   - HR Token: 'userToken' key
   - Job Seeker Token: 'jobSeekerToken' key
   - Allows both to be logged in simultaneously

## Page Details

### Register
- Form fields: email, password, firstName, lastName, phone, bio, skills
- Submits to `/auth/job-seeker/register`
- On success: stores token, redirects to job search
- Validation: email format, password strength

### JobSearch
- Fetches from `/jobs` (public, no auth needed)
- Filters: location dropdown, salary range
- Job cards show: title, company, location, salary
- Actions: View Details, Save Job, Apply
- pagination support

### JobDetails
- Fetch single job from `/jobs/:id`
- Shows full description, requirements, company info
- Apply button opens modal with optional cover letter
- Save/Unsave button
- Back to search button

### MyApplications
- Fetch from `/job-applications` (with JWT)
- Filter by status: applied, rejected, accepted, withdrawn
- Table view with: job title, status badge, applied date, company
- Actions: View, Withdraw
- Links to view job details

### SavedJobs
- Fetch from `/saved-jobs` (with JWT)
- Grid of saved job cards
- Unsave button
- Quick apply functionality
- Similar to search but shows only saved

### Profile
- Display current profile info
- Edit form for: firstName, lastName, phone, bio, profilePicture, resume, skills
- Manage work experience (add/edit/delete)
- Manage education (add/edit/delete)
- Save changes button

## Common Patterns

```javascript
// API call pattern
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
const result = await response.json();

// Get token pattern
const token = localStorage.getItem('jobSeekerToken');

// Protected route pattern
if (!token) {
  // Redirect to login
}

// Form handling
const [formData, setFormData] = useState({...});
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({...prev, [name]: value}));
};
```

## Styling Classes Available

Use these from the global index.css:
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.badge`, `.badge-success`, `.badge-warning`, `.badge-danger`
- `.card`, `.stat-card`
- `.form-group`, `.form-row`
- `.modal`, `.modal-content`, `.modal-header`
- `.empty-state`
- `.table`, `.error`, `.success-msg`

## Next Steps

1. Create `.jsx` files for each page in `/pages/JobSeeker/`
2. Create reusable components in `/components/JobSeeker/`
3. Create `.css` files in `/styles/JobSeeker/`
4. Update `App.jsx` to detect job seeker user and route accordingly
5. Create a JobSeeker-specific Navigation component
6. Test with backend API endpoints
