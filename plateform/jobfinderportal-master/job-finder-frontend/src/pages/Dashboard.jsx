import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // TODO: Fetch stats from API
    setStats({
      totalJobs: 12,
      totalApplicants: 45,
      scheduledMeetings: 8,
      activeJobs: 5
    });

    // TODO: Fetch recent applications from API
    setRecentApplications([
      {
        id: 1,
        name: 'John Smith',
        position: 'Senior Developer',
        date: '2024-03-28',
        status: 'reviewing'
      },
      {
        id: 2,
        name: 'Jane Doe',
        position: 'Product Manager',
        date: '2024-03-27',
        status: 'shortlisted'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        position: 'UI/UX Designer',
        date: '2024-03-26',
        status: 'interview_scheduled'
      }
    ]);

    // TODO: Fetch upcoming meetings from API
    setUpcomingMeetings([
      {
        id: 1,
        applicant: 'Jane Doe',
        position: 'Product Manager',
        dateTime: '2024-04-02 10:00 AM',
        interviewer: 'Sarah Wilson'
      },
      {
        id: 2,
        applicant: 'Mike Johnson',
        position: 'UI/UX Designer',
        dateTime: '2024-04-03 2:00 PM',
        interviewer: 'Tom Brown'
      }
    ]);
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No upcoming meetings scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
