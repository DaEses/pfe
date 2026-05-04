import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, requiredRole }) {
  const { isLoading, isLoggedIn, userRole } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid rgba(37, 99, 235, 0.2)',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ marginTop: '16px', color: '#64748b' }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={requiredRole === 'jobseeker' ? '/login' : '/hr/login'} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={requiredRole === 'jobseeker' ? '/login' : '/hr/login'} replace />;
  }

  return children;
}

export default ProtectedRoute;
