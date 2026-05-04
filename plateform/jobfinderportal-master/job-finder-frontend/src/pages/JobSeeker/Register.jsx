import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthCard from '../../components/auth/AuthCard';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/auth/Button';
import AlertBox from '../../components/auth/AlertBox';
import '../../styles/auth.css';

function JobSeekerRegister() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    skills: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/job-seeker/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          bio: formData.bio,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Your Profile"
      subtitle="Start your job search journey"
      theme="jobseeker"
      maxWidth="500px"
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <span style={{ background: '#f3e8ff', color: '#a855f7', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
          JOB SEEKER
        </span>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <AlertBox type="error" message={error} />}
        {successMessage && <AlertBox type="success" message={successMessage} />}

        <div className="auth-form-row">
          <FormInput
            id="firstName"
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            required
          />
          <FormInput
            id="lastName"
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            required
          />
        </div>

        <FormInput
          id="email"
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="you@example.com"
          required
        />

        <div className="auth-form-row">
          <FormInput
            id="password"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            required
          />
          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="••••••••"
            required
          />
        </div>

        <FormInput
          id="phone"
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+1 (555) 000-0000"
        />

        <div>
          <label htmlFor="bio" className="form-label">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            rows="3"
            className="auth-textarea"
          />
        </div>

        <FormInput
          id="skills"
          label="Skills (comma-separated)"
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleInputChange}
          placeholder="e.g. JavaScript, React, Node.js"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          theme="jobseeker"
        >
          Create Account
        </Button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          Already have an account? <button onClick={() => navigate('/login')} className="auth-link-btn">Sign in</button>
        </p>
        <p className="auth-footer-text">
          Looking to hire? <button onClick={() => navigate('/hr/signup')} className="auth-link-btn">HR Sign Up</button>
        </p>
      </div>
    </AuthCard>
  );
}

export default JobSeekerRegister;
