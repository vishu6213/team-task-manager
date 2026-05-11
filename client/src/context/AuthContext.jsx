import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Session recovery error:', error);
          // Only clear token if it's a confirmed authentication error (401)
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            setUser(null);
          }
          // For other errors (like network issues), we keep the token and 
          // potentially try again on next mount or just let protected routes handle it.
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { token, ...userData } = data;
      localStorage.setItem('token', token);
      setUser(userData);
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      const { token, ...userData } = data;
      localStorage.setItem('token', token);
      setUser(userData);
      toast.success('Registered successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
