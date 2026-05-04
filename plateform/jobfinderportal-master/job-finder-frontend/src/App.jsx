import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListingPage from './pages/JobListingPage';
import Dashboard from './pages/Dashboard';
import JobPostings from './pages/JobPostings';
import Applicants from './pages/Applicants';
import ScheduledMeetings from './pages/ScheduledMeetings';
import JobSeekerLogin from './pages/JobSeeker/Login';
import JobSeekerRegister from './pages/JobSeeker/Register';
import JobSearch from './pages/JobSeeker/JobSearch';
import './App.css';

function AppContent() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Job Seeker Routes (Default) */}
        <Route path="/login" element={<JobSeekerLogin />} />
        <Route path="/signup" element={<JobSeekerRegister />} />
        <Route
          path="/job-seeker/search"
          element={
            <ProtectedRoute requiredRole="jobseeker">
              <JobSearch />
            </ProtectedRoute>
          }
        />

        {/* HR Routes */}
        <Route path="/hr/login" element={<LoginPage />} />
        <Route path="/hr/signup" element={<RegisterPage />} />
        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute requiredRole="hr">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/job-postings"
          element={
            <ProtectedRoute requiredRole="hr">
              <JobPostings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/applicants"
          element={
            <ProtectedRoute requiredRole="hr">
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/scheduled-meetings"
          element={
            <ProtectedRoute requiredRole="hr">
              <ScheduledMeetings />
            </ProtectedRoute>
          }
        />

        {/* Legacy route for job listings */}
        <Route path="/job_listing" element={<JobListingPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
