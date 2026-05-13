import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const hrToken = localStorage.getItem('hrUserToken');
      const jobSeekerToken = localStorage.getItem('jobSeekerToken');
      const hrUserData = localStorage.getItem('hrUser');

      if (hrToken) {
        setIsLoggedIn(true);
        setUserRole('hr');
        if (hrUserData) {
          try {
            setUser(JSON.parse(hrUserData));
          } catch (e) {
            console.error('Failed to parse user data:', e);
          }
        }
      } else if (jobSeekerToken) {
        setIsLoggedIn(true);
        setUserRole('jobseeker');
        setUser(null);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setUser(null);
      }
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Failed to check authentication');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((role, userData, token) => {
    if (role === 'hr') {
      localStorage.setItem('hrUserToken', token);
      if (userData) {
        localStorage.setItem('hrUser', JSON.stringify(userData));
        setUser(userData);
      }
    } else if (role === 'jobseeker') {
      localStorage.setItem('jobSeekerToken', token);
      setUser(null);
    }

    setIsLoggedIn(true);
    setUserRole(role);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hrUserToken');
    localStorage.removeItem('jobSeekerToken');
    localStorage.removeItem('hrUser');

    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    isLoading,
    isLoggedIn,
    userRole,
    user,
    error,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
