# HR Platform Frontend

A modern, full-featured HR recruitment management system built with React and Vite.

## Features

### 📊 Dashboard
- Overview of recruitment metrics
- Quick stats on job postings, applicants, and scheduled meetings
- Recent applications with status tracking
- Upcoming interviews at a glance

### 💼 Job Postings
- Create new job postings with details
- View all active and archived positions
- Track application counts for each position
- Edit job descriptions and requirements

### 👥 Applicants Management
- View all applicants with detailed information
- Filter applicants by status (Reviewing, Shortlisted, Interview Scheduled, Rejected)
- Track evaluation scores
- Update applicant status
- Contact applicants via email or phone

### 📅 Scheduled Meetings
- Schedule interviews with applicants
- Track interview details (date, time, location, interviewer)
- Manage upcoming and completed meetings
- Add notes for each interview

### 🔐 Authentication
- Simple login system with demo credentials
- Session persistence using localStorage

## Tech Stack

- **React 19.2** - UI Framework
- **Vite 8** - Build tool and dev server
- **CSS3** - Custom styling with CSS variables
- **Modern JavaScript (ES6+)**

## Getting Started

### Installation

```bash
cd job-finder-frontend
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm preview
```

## Demo Credentials

- **Email:** hr@company.com
- **Password:** any password (for demo purposes)

## Project Structure

```
src/
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Dashboard.jsx       # Main dashboard
│   ├── JobPostings.jsx     # Job postings management
│   ├── Applicants.jsx      # Applicants management
│   └── ScheduledMeetings.jsx # Meeting scheduling
├── components/
│   └── Navigation.jsx      # Sidebar navigation
├── styles/
│   ├── Login.css
│   ├── Navigation.css
│   ├── Dashboard.css
│   ├── JobPostings.css
│   ├── Applicants.css
│   └── ScheduledMeetings.css
├── App.jsx                 # Main app component with routing
├── App.css                 # App layout styles
├── index.css               # Global styles and variables
└── main.jsx                # Entry point
```

## Component Features

### Navigation
- Responsive sidebar with navigation menu
- Active page highlighting
- User profile display
- Quick logout button
- Mobile-friendly collapsed view

### Dashboard
- Stats cards with key metrics
- Recent applications section
- Upcoming meetings preview
- Quick status indicators

### Job Postings
- Grid view of job cards
- Create modal form for new postings
- Status badges (Active/Closed)
- Applicant count display

### Applicants
- Table view with sorting capabilities
- Status filtering
- Detailed applicant modal
- Status update actions
- Evaluation score visualization
- Contact information links

### Scheduled Meetings
- Card view for better readability
- Upcoming and completed sections
- Schedule new meeting modal
- Mark as completed functionality
- Cancel meeting option

## Styling System

The application uses CSS custom properties for theming:

### Color Variables
- `--accent`: Primary action color (#aa3bff)
- `--success`: Success state (#10b981)
- `--danger`: Error/delete state (#ef4444)
- `--warning`: Warning state (#f59e0b)
- `--info`: Information state (#3b82f6)

### Responsive Design
- Mobile-first approach
- Breakpoints at 1024px and 768px
- Flexible grid layouts
- Touch-friendly button sizes

## Usage Examples

### Login Flow
1. App checks localStorage for existing user
2. If no user, shows login page
3. On login, user data is stored in localStorage
4. User is redirected to dashboard

### Creating a Job Posting
1. Click "+ Create New Job" button
2. Fill in job details (title, department, location, description)
3. Submit form to add to list
4. Success message confirms creation

### Managing Applicants
1. View all applicants in table format
2. Filter by status using dropdown
3. Click "View" to see detailed modal
4. Update applicant status as needed
5. Changes are immediately reflected

### Scheduling Meetings
1. Click "+ Schedule Meeting" button
2. Enter applicant and meeting details
3. Save to add to upcoming meetings
4. View, complete, or cancel meetings as needed

## API Integration

Currently, the application uses mock data stored in component state. To integrate with a backend API:

1. Replace mock data initializations with API calls
2. Update form submissions to send data to backend
3. Add error handling for API failures
4. Implement proper authentication tokens

Example locations for API integration:
- `Dashboard.jsx`: `useEffect` hook for fetching stats
- `JobPostings.jsx`: `handleSubmit` for creating jobs
- `Applicants.jsx`: Filter and status update calls
- `ScheduledMeetings.jsx`: Meeting CRUD operations

## Customization

### Changing Colors
Edit CSS variables in `index.css`:
```css
:root {
  --accent: #your-color;
  --success: #your-color;
  /* ... */
}
```

### Adding New Pages
1. Create new component in `pages/` folder
2. Add CSS file in `styles/` folder
3. Import in `App.jsx`
4. Add navigation item to `Navigation.jsx`
5. Update page rendering logic in `App.jsx`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Production build size: ~17KB CSS, ~217KB JS (gzipped)
- Optimized asset loading with Vite
- Efficient CSS with no external dependencies

## Future Enhancements

- Backend API integration
- Advanced filtering and search
- Resume/CV uploads and parsing
- Email notifications
- Interview feedback forms
- Export applicant data
- Role-based access control
- Dark mode toggle
- Real-time collaboration features

## Support

For issues or questions, please check the main project documentation or create an issue in the repository.
