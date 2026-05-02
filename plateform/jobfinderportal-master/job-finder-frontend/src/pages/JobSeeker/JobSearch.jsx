import { useState, useEffect } from 'react';
import '../../styles/JobSeeker/job-search.css';
import InterviewPanel from '../../components/InterviewPanel';
import StartInterviewModal from '../../components/StartInterviewModal';

function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minSalary: '',
    maxSalary: '',
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [showStartInterviewModal, setShowStartInterviewModal] = useState(false);
  const [interviewRefresh, setInterviewRefresh] = useState(0);

  const token = localStorage.getItem('jobSeekerToken');

  useEffect(() => {
    fetchJobs();
    if (token) {
      fetchSavedJobs();
    }
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.minSalary) params.append('minSalary', filters.minSalary);
      if (filters.maxSalary) params.append('maxSalary', filters.maxSalary);

      const response = await fetch(`http://localhost:3000/api/jobs?${params}`);
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/saved-jobs', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setSavedJobs(Array.isArray(data) ? data.map(s => s.jobPostingId) : []);
    } catch (err) {
      console.log('Failed to load saved jobs');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyClick = (job) => {
    if (!token) {
      alert('Please login to apply for jobs');
      return;
    }
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleApplySubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobPostingId: selectedJob.id,
          coverLetter,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Application submitted successfully!');
        setShowApplyModal(false);
        setCoverLetter('');
        setSelectedJob(null);
      } else {
        alert(result.message || 'Application failed');
      }
    } catch (err) {
      alert('Failed to submit application');
    }
  };

  const handleSaveJob = async (jobId) => {
    if (!token) {
      alert('Please login to save jobs');
      return;
    }

    try {
      const isSaved = savedJobs.includes(jobId);
      const method = isSaved ? 'DELETE' : 'POST';
      const endpoint = isSaved ? `http://localhost:3000/api/saved-jobs/${jobId}` : `http://localhost:3000/api/saved-jobs/${jobId}`;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success || result.data) {
        if (isSaved) {
          setSavedJobs(savedJobs.filter(id => id !== jobId));
        } else {
          setSavedJobs([...savedJobs, jobId]);
        }
      }
    } catch (err) {
      alert('Failed to save job');
    }
  };

  const handleInterviewStarted = () => {
    setInterviewRefresh(prev => prev + 1);
  };

  return (
    <div className="job-search">
      <div className="page-header">
        <h1>Find Your Next Job</h1>
        <p className="page-subtitle">Browse and apply to open positions</p>
      </div>

      <div className="tabs-section">
        <button
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          🔍 Find Jobs
        </button>
        <button
          className={`tab-btn ${activeTab === 'interviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('interviews')}
        >
          📅 My Interviews
        </button>
      </div>

      {activeTab === 'jobs' ? (
        <>
          <div className="filter-section">
        <div className="filter-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="e.g., New York, Remote"
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label>Min Salary ($)</label>
          <input
            type="number"
            name="minSalary"
            value={filters.minSalary}
            onChange={handleFilterChange}
            placeholder="Minimum"
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label>Max Salary ($)</label>
          <input
            type="number"
            name="maxSalary"
            value={filters.maxSalary}
            onChange={handleFilterChange}
            placeholder="Maximum"
            className="filter-input"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : jobs.length > 0 ? (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                <div>
                  <h3>{job.title}</h3>
                  <p className="job-company">{job.postedBy?.companyName || 'Company'}</p>
                </div>
                <button
                  className="save-btn"
                  onClick={() => handleSaveJob(job.id)}
                  title={savedJobs.includes(job.id) ? 'Unsave job' : 'Save job'}
                >
                  {savedJobs.includes(job.id) ? '❤️' : '🤍'}
                </button>
              </div>

              <p className="job-location">📍 {job.location}</p>
              {job.salary && <p className="job-salary">${job.salary.toLocaleString()}/year</p>}

              <p className="job-description">{job.description.substring(0, 150)}...</p>

              <div className="job-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {/* View details */}}
                >
                  View Details
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleApplyClick(job)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No jobs found. Try adjusting your filters.</p>
        </div>
      )}
        </>
      ) : (
        <>
          <InterviewPanel key={interviewRefresh} onStartInterview={() => setShowStartInterviewModal(true)} />
        </>
      )}

      {showApplyModal && selectedJob && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Apply for {selectedJob.title}</h2>
              <button
                className="modal-close"
                onClick={() => setShowApplyModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="apply-form">
              <div className="form-group">
                <label>Cover Letter (Optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're interested..."
                  rows="6"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleApplySubmit}
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showStartInterviewModal && (
        <StartInterviewModal
          onClose={() => setShowStartInterviewModal(false)}
          onInterviewStarted={handleInterviewStarted}
        />
      )}
    </div>
  );
}

export default JobSearch;