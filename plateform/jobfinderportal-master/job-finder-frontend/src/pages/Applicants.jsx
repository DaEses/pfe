import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Applicants.css';

function Applicants() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'applied', label: 'Applied' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'interview_completed', label: 'Interview Completed' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Fetch job postings on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.getJobPostings();
        setJobs(data);
        if (data.length > 0) {
          setSelectedJob(data[0].id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applicants when selected job changes
  useEffect(() => {
    if (!selectedJob) return;

    const fetchApplicants = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getApplicants(selectedJob);
        setApplicants(data);
        setFilterStatus('all');
        setSelectedApplicant(null);
      } catch (err) {
        setError(err.message || 'Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [selectedJob]);

  // Update filtered applicants when status filter changes
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredApplicants(applicants);
    } else {
      setFilteredApplicants(applicants.filter(app => app.status === filterStatus));
    }
  }, [filterStatus, applicants]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return <span className="badge badge-info">Applied</span>;
      case 'shortlisted':
        return <span className="badge badge-success">Shortlisted</span>;
      case 'interview_scheduled':
        return <span className="badge badge-warning">Interview Scheduled</span>;
      case 'interview_completed':
        return <span className="badge badge-info">Interview Completed</span>;
      case 'accepted':
        return <span className="badge badge-success">Accepted</span>;
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const updateApplicantStatus = async (applicantId, newStatus) => {
    try {
      setError('');
      setSuccess('');
      await api.updateApplicationStatus(applicantId, newStatus);

      // Update local state
      const updated = applicants.map(app =>
        app.id === applicantId ? { ...app, status: newStatus } : app
      );
      setApplicants(updated);
      setSelectedApplicant(null);
      setSuccess(`Candidate status updated to ${newStatus}`);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const currentJob = jobs.find(j => j.id === selectedJob);

  return (
    <div className="applicants">
      <div className="page-header">
        <div>
          <h1>Applicants</h1>
          <p className="page-subtitle">Review and manage job applications</p>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          borderLeft: '4px solid #c33'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#efe',
          color: '#3c3',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          borderLeft: '4px solid #3c3'
        }}>
          {success}
        </div>
      )}

      <div className="job-selector" style={{ marginBottom: '20px' }}>
        <label>Select Job Position:</label>
        <select
          value={selectedJob || ''}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="form-control"
        >
          {jobs.map(job => (
            <option key={job.id} value={job.id}>
              {job.title} ({job.applicantCount || 0} applicants)
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="filter-count">Showing {filteredApplicants.length} applicant(s) {currentJob && `for ${currentJob.title}`}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading applicants...</p>
        </div>
      ) : (
        <div className="applicants-container">
          {filteredApplicants.length > 0 ? (
            <div className="applicants-table-wrapper">
              <table className="table applicants-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map(applicant => (
                    <tr key={applicant.id} className="applicant-row">
                      <td className="name-cell">
                        <strong>{applicant.applicantName}</strong>
                      </td>
                      <td>
                        <a href={`mailto:${applicant.applicantEmail}`}>{applicant.applicantEmail}</a>
                      </td>
                      <td>{new Date(applicant.appliedAt).toLocaleDateString()}</td>
                      <td>{getStatusBadge(applicant.status)}</td>
                      <td>
                        {applicant.rating ? (
                          <div className="score-bar">
                            <div
                              className="score-fill"
                              style={{ width: `${Math.min(applicant.rating * 10, 100)}%` }}
                            ></div>
                            <span className="score-text">{applicant.rating}/10</span>
                          </div>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => setSelectedApplicant(applicant)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No applicants found with the selected filter.</p>
            </div>
          )}
        </div>
      )}

      {selectedApplicant && (
        <div className="modal active">
          <div className="modal-content detailed-modal">
            <div className="modal-header">
              <h2>{selectedApplicant.applicantName}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedApplicant(null)}
              >
                ✕
              </button>
            </div>

            <div className="applicant-details">
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <a href={`mailto:${selectedApplicant.applicantEmail}`} className="detail-value">
                  {selectedApplicant.applicantEmail}
                </a>
              </div>

              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <a href={`tel:${selectedApplicant.applicantPhone}`} className="detail-value">
                  {selectedApplicant.applicantPhone}
                </a>
              </div>

              <div className="detail-row">
                <span className="detail-label">Applied Date:</span>
                <span className="detail-value">
                  {new Date(selectedApplicant.appliedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  {getStatusBadge(selectedApplicant.status)}
                </span>
              </div>

              {selectedApplicant.rating && (
                <div className="detail-row">
                  <span className="detail-label">Rating:</span>
                  <div className="score-bar-large">
                    <div
                      className="score-fill"
                      style={{ width: `${Math.min(selectedApplicant.rating * 10, 100)}%` }}
                    ></div>
                    <span className="score-text">{selectedApplicant.rating}/10</span>
                  </div>
                </div>
              )}

              {selectedApplicant.notes && (
                <div className="detail-row">
                  <span className="detail-label">Notes:</span>
                  <p className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{selectedApplicant.notes}</p>
                </div>
              )}

              {selectedApplicant.applicantResume && (
                <div className="detail-row">
                  <span className="detail-label">Resume:</span>
                  <p className="detail-value">{selectedApplicant.applicantResume.substring(0, 200)}...</p>
                </div>
              )}

              <div className="action-section">
                <label>Update Status:</label>
                <div className="status-buttons">
                  <button
                    className="btn btn-secondary"
                    onClick={() => updateApplicantStatus(selectedApplicant.id, 'applied')}
                  >
                    Applied
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => updateApplicantStatus(selectedApplicant.id, 'shortlisted')}
                  >
                    Shortlist
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => updateApplicantStatus(selectedApplicant.id, 'interview_scheduled')}
                  >
                    Schedule Interview
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => updateApplicantStatus(selectedApplicant.id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => updateApplicantStatus(selectedApplicant.id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => setSelectedApplicant(null)}
                style={{ marginTop: '20px', width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applicants;
