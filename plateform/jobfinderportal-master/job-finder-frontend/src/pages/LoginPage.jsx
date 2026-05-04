import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiCall } from '../services/api';
import AuthCard from '../components/auth/AuthCard';
import FormInput from '../components/auth/FormInput';
import Button from '../components/auth/Button';
import AlertBox from '../components/auth/AlertBox';
import '../styles/auth.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login('hr', result.data, result.access_token);
      navigate('/hr/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to your HR account" theme="hr" maxWidth="420px">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span style={{ background: '#dbeafe', color: '#2563eb', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
          HR PLATFORM
        </span>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <AlertBox type="error" message={error} />}

        <FormInput
          id="email"
          label="Email Address"
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              className="auth-checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <a href="#" className="auth-link">Forgot Password?</a>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          theme="hr"
        >
          Sign In
        </Button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          Don't have an account? <a href="/hr/signup" className="auth-link">Create account</a>
        </p>
        <p className="auth-footer-text">
          Looking for jobs? <a href="/login" className="auth-link">Job Seeker Login</a>
        </p>
      </div>
    </AuthCard>
  );
}

export default LoginPage;
