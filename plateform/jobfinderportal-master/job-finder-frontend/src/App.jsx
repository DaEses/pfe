import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'hr' or 'jobseeker'

  useEffect(() => {
    const hrToken = localStorage.getItem('hrUserToken');
    const jobSeekerToken = localStorage.getItem('jobSeekerToken');

    if (hrToken) {
      setIsLoggedIn(true);
      setUserRole('hr');
    } else if (jobSeekerToken) {
      setIsLoggedIn(true);
      setUserRole('jobseeker');
    }
  }, []);

  return (
    <div className="app">
      <Header isLoggedIn={isLoggedIn} userRole={userRole} />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* HR Routes */}
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/hr/dashboard" element={isLoggedIn && userRole === 'hr' ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/hr/job-postings" element={isLoggedIn && userRole === 'hr' ? <JobPostings /> : <Navigate to="/login" />} />
        <Route path="/hr/applicants" element={isLoggedIn && userRole === 'hr' ? <Applicants /> : <Navigate to="/login" />} />
        <Route path="/hr/scheduled-meetings" element={isLoggedIn && userRole === 'hr' ? <ScheduledMeetings /> : <Navigate to="/login" />} />

        {/* Legacy route for job listings */}
        <Route path="/job_listing" element={<JobListingPage />} />

        {/* Job Seeker Routes */}
        <Route path="/job-seeker/login" element={<JobSeekerLogin setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
        <Route path="/job-seeker/register" element={<JobSeekerRegister />} />
        <Route path="/job-seeker/search" element={isLoggedIn && userRole === 'jobseeker' ? <JobSearch /> : <Navigate to="/job-seeker/login" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
