const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('hrUserToken') || localStorage.getItem('jobSeekerToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'API Error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const api = {
  // Job Postings
  getJobPostings: () => apiCall('/job-postings'),
  getJobPosting: (id) => apiCall(`/job-postings/${id}`),
  createJobPosting: (data) => apiCall('/job-postings', { method: 'POST', body: JSON.stringify(data) }),
  updateJobPosting: (id, data) => apiCall(`/job-postings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteJobPosting: (id) => apiCall(`/job-postings/${id}`, { method: 'DELETE' }),

  // Applications
  getApplicants: (jobPostingId) => apiCall(`/job-postings/${jobPostingId}/applicants`),
  getApplications: () => apiCall('/applications'),
  getApplication: (id) => apiCall(`/applications/${id}`),
  updateApplicationStatus: (id, status) => apiCall(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  deleteApplication: (id) => apiCall(`/applications/${id}`, { method: 'DELETE' }),

  // Interviews
  getInterviews: () => apiCall('/interviews'),
  getUpcomingInterviews: () => apiCall('/interviews/upcoming'),
  createInterview: (applicationId, data) => apiCall(`/interviews/${applicationId}`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateInterview: (id, data) => apiCall(`/interviews/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deleteInterview: (id) => apiCall(`/interviews/${id}`, { method: 'DELETE' }),
};
