import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiCall } from '../../services/api';
import AuthCard from '../../components/auth/AuthCard';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/auth/Button';
import AlertBox from '../../components/auth/AlertBox';
import '../../styles/auth.css';

function JobSeekerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
        login('jobseeker', null, result.token || result.access_token);
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
    <AuthCard
      title="Find Your Next Opportunity"
      subtitle="Sign in to your job seeker account"
      theme="jobseeker"
      maxWidth="420px"
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span style={{ background: '#f3e8ff', color: '#a855f7', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
          JOB SEEKER
        </span>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <AlertBox type="error" message={error} />}

        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          theme="jobseeker"
        >
          Sign In
        </Button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          Don't have an account? <button onClick={() => navigate('/signup')} className="auth-link-btn">Create account</button>
        </p>
        <p className="auth-footer-text">
          Looking to hire? <button onClick={() => navigate('/hr/login')} className="auth-link-btn">HR Platform</button>
        </p>
      </div>
    </AuthCard>
  );
}

export default JobSeekerLogin;
