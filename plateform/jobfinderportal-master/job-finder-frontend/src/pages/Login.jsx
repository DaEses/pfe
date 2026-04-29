import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function HRLogin({ onLogin }) {
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
      if (email && password) {
        // Simulated login
        const user = {
          id: 1,
          email,
          name: email.split('@')[0],
          role: 'hr'
        };
        localStorage.setItem('hrUser', JSON.stringify(user));
        onLogin(user);
        navigate('/hr/dashboard');
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>HR Platform</h1>
          <p className="subtitle">Manage jobs, applicants & interviews</p>
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
          <p className="demo-text">Demo credentials:</p>
          <p className="demo-info">Email: hr@company.com</p>
          <p className="demo-info">Password: any password</p>
          <hr style={{ margin: '10px 0' }} />
          <p>Looking for a job? <button onClick={() => navigate('/job-seeker/login')} className="link-btn">Job Seeker Login</button></p>
        </div>
      </div>
    </div>
  );
}

export default HRLogin;
