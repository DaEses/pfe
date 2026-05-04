import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import FormInput from '../components/auth/FormInput';
import Button from '../components/auth/Button';
import AlertBox from '../components/auth/AlertBox';
import '../styles/auth.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyDescription: '',
    terms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!formData.terms) {
      setError('Please agree to Terms and Conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          companyDescription: formData.companyDescription,
          phone: formData.phone,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/hr/login');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create Your Account" subtitle="Join as an HR Partner" theme="hr" maxWidth="480px">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span style={{ background: '#dbeafe', color: '#2563eb', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
          HR PLATFORM
        </span>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <AlertBox type="error" message={error} />}
        {success && <AlertBox type="success" message={success} />}

        <FormInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={handleChange}
          name="email"
          required
        />

        <FormInput
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={handleChange}
          name="phone"
        />

        <div className="auth-form-row">
          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            name="password"
            required
          />

          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            required
          />
        </div>

        <FormInput
          id="companyName"
          label="Company Name"
          type="text"
          placeholder="Your Company Inc."
          value={formData.companyName}
          onChange={handleChange}
          name="companyName"
          required
        />

        <div>
          <label htmlFor="companyDescription" className="form-label">Company Description</label>
          <textarea
            id="companyDescription"
            name="companyDescription"
            placeholder="Tell us about your company..."
            rows="3"
            className="auth-textarea"
            value={formData.companyDescription}
            onChange={handleChange}
          />
        </div>

        <label className="auth-checkbox-label">
          <input
            type="checkbox"
            className="auth-checkbox"
            id="terms"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          I agree to the <a href="#" className="auth-link">Terms and Conditions</a> and <a href="#" className="auth-link">Privacy Policy</a>
        </label>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          theme="hr"
        >
          Create Account
        </Button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          Already have an account? <a href="/hr/login" className="auth-link">Sign in</a>
        </p>
        <p className="auth-footer-text">
          Looking for a job? <a href="/signup" className="auth-link">Job Seeker Sign Up</a>
        </p>
      </div>
    </AuthCard>
  );
}

export default RegisterPage;
