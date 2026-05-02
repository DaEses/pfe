import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListingPage from './pages/JobListingPage';
import JobSeekerLogin from './pages/JobSeeker/Login';
import JobSeekerRegister from './pages/JobSeeker/Register';
import JobSearch from './pages/JobSeeker/JobSearch';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app">
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/job_listing" element={<JobListingPage />} />

        {/* Job Seeker Routes */}
        <Route path="/job-seeker/login" element={<JobSeekerLogin />} />
        <Route path="/job-seeker/register" element={<JobSeekerRegister />} />
        <Route path="/job-seeker/search" element={<JobSearch />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
