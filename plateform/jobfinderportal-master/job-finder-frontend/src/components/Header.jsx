import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, userRole, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(userRole === 'jobseeker' ? '/login' : '/hr/login');
  };

  if (isLoading) {
    return <header><div className="header-area header-transparrent"></div></header>;
  }

  return (
    <header>
      <div className="header-area header-transparrent">
        <div className="headder-top header-sticky">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-3 col-md-2">
                <div className="logo">
                  <button
                    onClick={() => navigate('/')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0'
                    }}
                  >
                    <img src="/assets/img/logo/logo.png" alt="Job Finder Logo" />
                  </button>
                </div>
              </div>
              <div className="col-lg-9 col-md-9">
                <div className="menu-wrapper">
                  <div className="main-menu">
                    <nav className="d-none d-lg-block">
                      <ul id="navigation">
                        <li><button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Home</button></li>
                        <li><button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>About</button></li>
                        <li>
                          <a href="#">Page</a>
                          <ul className="submenu">
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Blog Details</a></li>
                            <li><a href="#">Elements</a></li>
                            <li><a href="#">Job Details</a></li>
                          </ul>
                        </li>
                        <li><a href="#">Contact</a></li>
                      </ul>
                    </nav>
                  </div>
                  <div className="header-btn d-none f-right d-lg-block">
                    {!isLoggedIn ? (
                      <>
                        <button
                          onClick={() => navigate('/signup')}
                          className="btn head-btn1"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Sign Up
                        </button>
                        <button
                          onClick={() => navigate('/login')}
                          className="btn head-btn2"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Login
                        </button>
                        <button
                          onClick={() => navigate('/hr/login')}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#666',
                            fontSize: '14px',
                            marginLeft: '15px',
                            textDecoration: 'underline'
                          }}
                        >
                          HR Login
                        </button>
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {user && (
                          <span style={{ color: '#333', fontSize: '14px' }}>
                            {user.email || user.name || 'User'}
                          </span>
                        )}
                        {userRole && (
                          <span
                            style={{
                              background: userRole === 'hr' ? '#2563eb' : '#a855f7',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}
                          >
                            {userRole === 'hr' ? 'HR' : 'Job Seeker'}
                          </span>
                        )}
                        <button
                          onClick={handleLogout}
                          className="btn head-btn2"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="mobile_menu d-block d-lg-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
