import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('hrUserToken', result.access_token);
        localStorage.setItem('hrUser', JSON.stringify(result.data));
        setIsLoggedIn(true);
        navigate('/');
      } else {
        setError(result.message || 'Login failed. Please try again.');
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
                  <h2>Login to Your Account</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <section className="contact-section" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="contact-form-wrapper" style={{ background: '#f9f9f9', padding: '40px', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>Sign In to Your Account</h3>

                {error && <div style={{ color: '#c33', background: '#fee', padding: '10px', borderRadius: '5px', marginBottom: '15px', borderLeft: '4px solid #c33' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email" style={{ marginBottom: '10px', fontWeight: '500' }}>Email Address</label>
                    <input
                      className="form-control"
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" style={{ marginBottom: '10px', fontWeight: '500' }}>Password</label>
                    <input
                      className="form-control"
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="remember">Remember me</label>
                    </div>
                    <a href="#" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Forgot Password?</a>
                  </div>

                  <div className="form-group">
                    <button type="submit" className="button button-contactForm boxed-btn" style={{ width: '100%', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', background: '#ff6b6b', color: 'white', fontWeight: '600' }} disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                  <p style={{ color: '#666', marginBottom: '0' }}>Don't have an account? <a href="/register" style={{ color: '#ff6b6b', textDecoration: 'none', fontWeight: '500' }}>Register here</a></p>
                </div>

                {/* Social Login */}
                <div style={{ marginTop: '30px' }}>
                  <p style={{ textAlign: 'center', color: '#999', marginBottom: '20px' }}>Or login with</p>
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

export default LoginPage;
