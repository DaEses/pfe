import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../services/api';
import '../../styles/JobSeeker/login.css';

function JobSeekerLogin({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await apiCall('/auth/job-seeker/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (result.token || result.access_token) {
        localStorage.setItem('jobSeekerToken', result.token || result.access_token);
        setIsLoggedIn(true);
        setUserRole('jobseeker');
        navigate('/job-seeker/search');
      } else {
        setError('Invalid response from server (no token)');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Job Seeker Login</h1>
          <p className="subtitle">Find your next opportunity</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <button onClick={() => navigate('/job-seeker/register')} className="link-btn">Register here</button></p>
          <hr style={{ margin: '10px 0' }} />
          <p>Looking to hire? <button onClick={() => navigate('/hr/login')} className="link-btn">HR Platform</button></p>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerLogin;
