import { useState } from 'react';
import '../styles/Applicants.css';

function Applicants() {
  const [applicants, setApplicants] = useState([
    {
      id: 1,
      name: 'John Smith',
      position: 'Senior Developer',
      email: 'john@example.com',
      phone: '+1-555-0101',
      appliedDate: '2024-03-28',
      status: 'reviewing',
      score: 85
    },
    {
      id: 2,
      name: 'Jane Doe',
      position: 'Product Manager',
      email: 'jane@example.com',
      phone: '+1-555-0102',
      appliedDate: '2024-03-27',
      status: 'shortlisted',
      score: 92
    },
    {
      id: 3,
      name: 'Mike Johnson',
      position: 'UI/UX Designer',
      email: 'mike@example.com',
      phone: '+1-555-0103',
      appliedDate: '2024-03-26',
      status: 'interview_scheduled',
      score: 88
    },
    {
      id: 4,
      name: 'Emily Brown',
      position: 'Senior Developer',
      email: 'emily@example.com',
      phone: '+1-555-0104',
      appliedDate: '2024-03-25',
      status: 'rejected',
      score: 65
    },
    {
      id: 5,
      name: 'David Wilson',
      position: 'Product Manager',
      email: 'david@example.com',
      phone: '+1-555-0105',
      appliedDate: '2024-03-24',
      status: 'reviewing',
      score: 78
    }
  ]);

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const filteredApplicants = filterStatus === 'all'
    ? applicants
    : applicants.filter(app => app.status === filterStatus);

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

  const updateApplicantStatus = (id, newStatus) => {
    setApplicants(applicants.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    ));
    setSelectedApplicant(null);
  };

  return (
    <div className="applicants">
      <div className="page-header">
        <div>
          <h1>Applicants</h1>
          <p className="page-subtitle">Review and manage job applications</p>
        </div>
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
        <p className="filter-count">Showing {filteredApplicants.length} applicant(s)</p>
      </div>

      <div className="applicants-container">
        {filteredApplicants.length > 0 ? (
          <div className="applicants-table-wrapper">
            <table className="table applicants-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Applied Date</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map(applicant => (
                  <tr key={applicant.id} className="applicant-row">
                    <td className="name-cell">
                      <strong>{applicant.name}</strong>
                    </td>
                    <td>{applicant.position}</td>
                    <td>{new Date(applicant.appliedDate).toLocaleDateString()}</td>
                    <td>
                      <a href={`mailto:${applicant.email}`}>{applicant.email}</a>
                    </td>
                    <td>{getStatusBadge(applicant.status)}</td>
                    <td>
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{ width: `${applicant.score}%` }}
                        ></div>
                        <span className="score-text">{applicant.score}%</span>
                      </div>
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

      {selectedApplicant && (
        <div className="modal active">
          <div className="modal-content detailed-modal">
            <div className="modal-header">
              <h2>{selectedApplicant.name}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedApplicant(null)}
              >
                ✕
              </button>
            </div>

            <div className="applicant-details">
              <div className="detail-row">
                <span className="detail-label">Position:</span>
                <span className="detail-value">{selectedApplicant.position}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <a href={`mailto:${selectedApplicant.email}`} className="detail-value">
                  {selectedApplicant.email}
                </a>
              </div>

              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <a href={`tel:${selectedApplicant.phone}`} className="detail-value">
                  {selectedApplicant.phone}
                </a>
              </div>

              <div className="detail-row">
                <span className="detail-label">Applied Date:</span>
                <span className="detail-value">
                  {new Date(selectedApplicant.appliedDate).toLocaleDateString()}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  {getStatusBadge(selectedApplicant.status)}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Evaluation Score:</span>
                <div className="score-bar-large">
                  <div
                    className="score-fill"
                    style={{ width: `${selectedApplicant.score}%` }}
                  ></div>
                  <span className="score-text">{selectedApplicant.score}%</span>
                </div>
              </div>

              <div className="action-section">
                <label>Update Status:</label>
                <div className="status-buttons">
                  <button
                    className="btn btn-secondary"
                    onClick={() => updateApplicantStatus(selectedApplicant.id, 'reviewing')}
                  >
                    Under Review
                  </button>
                  <button
                    className="btn btn-success"
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
