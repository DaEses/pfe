import { useState } from 'react';
import '../styles/JobPostings.css';

function JobPostings() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Developer',
      department: 'Engineering',
      location: 'Remote',
      postedDate: '2024-03-20',
      status: 'active',
      applicants: 12
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      postedDate: '2024-03-15',
      status: 'active',
      applicants: 8
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      postedDate: '2024-03-10',
      status: 'closed',
      applicants: 21
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    description: '',
    requirements: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newJob = {
      id: jobs.length + 1,
      ...formData,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      applicants: 0
    };

    setJobs([newJob, ...jobs]);
    setFormData({
      title: '',
      department: '',
      location: '',
      description: '',
      requirements: ''
    });
    setShowModal(false);
    setSuccessMessage('Job posting created successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`badge ${status === 'active' ? 'badge-success' : 'badge-warning'}`}>
        {status === 'active' ? 'Active' : 'Closed'}
      </span>
    );
  };

  return (
    <div className="job-postings">
      <div className="page-header">
        <div>
          <h1>Job Postings</h1>
          <p className="page-subtitle">Manage your open positions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create New Job
        </button>
      </div>

      {successMessage && <div className="success-msg">{successMessage}</div>}

      <div className="jobs-container">
        {jobs.length > 0 ? (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  {getStatusBadge(job.status)}
                </div>
                <p className="job-department">Department: {job.department}</p>
                <p className="job-location">📍 {job.location}</p>
                <p className="job-date">Posted: {new Date(job.postedDate).toLocaleDateString()}</p>

                <div className="job-stats">
                  <div className="stat">
                    <span className="stat-number">{job.applicants}</span>
                    <span className="stat-label">Applicants</span>
                  </div>
                </div>

                <div className="job-actions">
                  <button className="btn btn-secondary btn-small">View Details</button>
                  <button className="btn btn-secondary btn-small">View Applicants</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No job postings yet. Create one to get started!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Job Posting</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Developer"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Engineering"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Remote"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the job responsibilities..."
                />
              </div>

              <div className="form-group">
                <label>Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="List the requirements and qualifications..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Job Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobPostings;
