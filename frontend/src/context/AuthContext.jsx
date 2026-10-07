import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('warranty_tracker_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('warranty_tracker_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('warranty_tracker_token');
      if (storedToken) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data);
          setToken(storedToken);
        } catch (err) {
          console.warn('Session verification failed:', err.response?.data?.message || err.message);
          logout();
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      const userData = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
      };
      setUser(userData);
      setToken(res.data.token);
      localStorage.setItem('warranty_tracker_token', res.data.token);
      localStorage.setItem('warranty_tracker_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials or database server.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      const userData = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
      };
      setUser(userData);
      setToken(res.data.token);
      localStorage.setItem('warranty_tracker_token', res.data.token);
      localStorage.setItem('warranty_tracker_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your input or database server.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('warranty_tracker_user');
    localStorage.removeItem('warranty_tracker_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
