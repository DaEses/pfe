import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    scheduledMeetings: 0,
    activeJobs: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch job postings
        const jobs = await api.getJobPostings();
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(j => j.status === 'active').length;

        // Calculate total applicants from all jobs
        let totalApplicants = 0;
        let recentApps = [];
        jobs.forEach(job => {
          totalApplicants += job.applicantCount || 0;
          if (job.applications) {
            recentApps = recentApps.concat(
              job.applications.map(app => ({
                id: app.id,
                name: app.applicantName,
                position: job.title,
                date: app.appliedAt,
                status: app.status,
                jobId: job.id,
                email: app.applicantEmail
              }))
            );
          }
        });

        // Sort by date and take 3 most recent
        recentApps.sort((a, b) => new Date(b.date) - new Date(a.date));
        recentApps = recentApps.slice(0, 3);

        // Fetch upcoming interviews
        const interviews = await api.getUpcomingInterviews();
        const upcoming = interviews.slice(0, 2).map(interview => ({
          id: interview.id,
          applicant: interview.application?.applicantName || 'Unknown',
          position: interview.application?.jobPosting?.title || 'Unknown',
          dateTime: new Date(interview.scheduledDateTime).toLocaleString(),
          interviewer: interview.approver?.companyName || 'TBD',
          type: interview.type,
          status: interview.status
        }));

        setStats({
          totalJobs,
          totalApplicants,
          scheduledMeetings: interviews.length,
          activeJobs
        });
        setRecentApplications(recentApps);
        setUpcomingMeetings(upcoming);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reviewing':
        return <span className="badge badge-info">Under Review</span>;
      case 'shortlisted':
        return <span className="badge badge-success">Shortlisted</span>;
      case 'interview_scheduled':
        return <span className="badge badge-warning">Interview Scheduled</span>;
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="header-subtitle">Welcome back! Here's your recruitment overview</p>
      </div>

      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          borderLeft: '4px solid #c33'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-content">
                <p className="stat-label">Total Job Postings</p>
                <p className="stat-value">{stats.totalJobs}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <p className="stat-label">Total Applicants</p>
                <p className="stat-value">{stats.totalApplicants}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <p className="stat-label">Scheduled Meetings</p>
                <p className="stat-value">{stats.scheduledMeetings}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <p className="stat-label">Active Positions</p>
                <p className="stat-value">{stats.activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="content-section">
              <h2>Recent Applications</h2>
              {recentApplications.length > 0 ? (
                <div className="applications-list">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="application-item">
                      <div className="app-info">
                        <h3>{app.name}</h3>
                        <p className="app-position">{app.position}</p>
                        <p className="app-date">Applied: {new Date(app.date).toLocaleDateString()}</p>
                        <p style={{ fontSize: '0.9em', color: '#666' }}>{app.email}</p>
                      </div>
                      <div className="app-status">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No recent applications</p>
              )}
            </div>

            <div className="content-section">
              <h2>Upcoming Meetings</h2>
              {upcomingMeetings.length > 0 ? (
                <div className="meetings-list">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="meeting-item">
                      <div className="meeting-time">⏰</div>
                      <div className="meeting-info">
                        <h3>{meeting.applicant}</h3>
                        <p className="meeting-position">{meeting.position}</p>
                        <p className="meeting-datetime">{meeting.dateTime}</p>
                        <p className="meeting-interviewer">Interviewer: {meeting.interviewer}</p>
                        <p style={{ fontSize: '0.9em', color: '#666' }}>Type: {meeting.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No upcoming meetings scheduled</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
