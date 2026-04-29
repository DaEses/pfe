import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: '',
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
      const endpoint = formData.userType === 'employer' ?
        'http://localhost:3000/api/auth/register' :
        'http://localhost:3000/api/auth/job-seeker/register';

      const body = formData.userType === 'employer' ? {
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        phone: formData.phone,
      } : {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
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
    <main>
      {/* Hero Area */}
      <div className="slider-area">
        <div className="single-slider section-overly slider-height2 d-flex align-items-center" style={{ backgroundImage: 'url(/assets/img/hero/about.jpg)' }}>
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="hero-cap text-center">
                  <h2>Create New Account</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Section */}
      <section className="contact-section" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-9">
              <div className="contact-form-wrapper" style={{ background: '#f9f9f9', padding: '40px', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>Create Your Account</h3>

                {error && <div style={{ color: '#c33', background: '#fee', padding: '10px', borderRadius: '5px', marginBottom: '15px', borderLeft: '4px solid #c33' }}>{error}</div>}
                {success && <div style={{ color: '#3c3', background: '#efe', padding: '10px', borderRadius: '5px', marginBottom: '15px', borderLeft: '4px solid #3c3' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="firstName" style={{ marginBottom: '10px', fontWeight: '500' }}>First Name</label>
                        <input
                          className="form-control"
                          id="firstName"
                          type="text"
                          name="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="lastName" style={{ marginBottom: '10px', fontWeight: '500' }}>Last Name</label>
                        <input
                          className="form-control"
                          id="lastName"
                          type="text"
                          name="lastName"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" style={{ marginBottom: '10px', fontWeight: '500' }}>Email Address</label>
                    <input
                      className="form-control"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" style={{ marginBottom: '10px', fontWeight: '500' }}>Phone Number</label>
                    <input
                      className="form-control"
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="password" style={{ marginBottom: '10px', fontWeight: '500' }}>Password</label>
                        <input
                          className="form-control"
                          id="password"
                          type="password"
                          name="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="confirmPassword" style={{ marginBottom: '10px', fontWeight: '500' }}>Confirm Password</label>
                        <input
                          className="form-control"
                          id="confirmPassword"
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="userType" style={{ marginBottom: '10px', fontWeight: '500' }}>I am a:</label>
                    <select
                      className="form-control"
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select account type</option>
                      <option value="jobseeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>

                  {formData.userType === 'employer' && (
                    <>
                      <div className="form-group">
                        <label htmlFor="companyName" style={{ marginBottom: '10px', fontWeight: '500' }}>Company Name</label>
                        <input
                          className="form-control"
                          id="companyName"
                          type="text"
                          name="companyName"
                          placeholder="Enter company name"
                          value={formData.companyName}
                          onChange={handleChange}
                          required={formData.userType === 'employer'}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="companyDescription" style={{ marginBottom: '10px', fontWeight: '500' }}>Company Description</label>
                        <textarea
                          className="form-control"
                          id="companyDescription"
                          name="companyDescription"
                          placeholder="Tell us about your company..."
                          rows="3"
                          value={formData.companyDescription}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </>
                  )}

                  <div className="form-group" style={{ marginBottom: '25px' }}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to the <a href="#" style={{ color: '#ff6b6b' }}>Terms and Conditions</a> and <a href="#" style={{ color: '#ff6b6b' }}>Privacy Policy</a>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <button type="submit" className="button button-contactForm boxed-btn" style={{ width: '100%', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', background: '#ff6b6b', color: 'white', fontWeight: '600' }} disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                  <p style={{ color: '#666', marginBottom: '0' }}>Already have an account? <a href="/login" style={{ color: '#ff6b6b', textDecoration: 'none', fontWeight: '500' }}>Login here</a></p>
                </div>

                {/* Social Sign Up */}
                <div style={{ marginTop: '30px' }}>
                  <p style={{ textAlign: 'center', color: '#999', marginBottom: '20px' }}>Or sign up with</p>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <a href="#" className="btn" style={{ flex: 1, backgroundColor: '#3b5998', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', textDecoration: 'none', textAlign: 'center' }}>
                      <i className="fab fa-facebook-f"></i> Facebook
                    </a>
                    <a href="#" className="btn" style={{ flex: 1, backgroundColor: '#1da1f2', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', textDecoration: 'none', textAlign: 'center' }}>
                      <i className="fab fa-twitter"></i> Twitter
                    </a>
                    <a href="#" className="btn" style={{ flex: 1, backgroundColor: '#dd4b39', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', textDecoration: 'none', textAlign: 'center' }}>
                      <i className="fab fa-google"></i> Google
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
