import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // Dynamic fallback: If we are on Vercel/Production, use the Render API
  if (typeof window !== 'undefined' && 
      (window.location.hostname.includes('vercel.app') || !window.location.hostname.includes('localhost'))) {
    return 'https://team-task-manager-ag7w.onrender.com/api';
  }
  
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Debug log for API URL
console.log('API connectivity initialized at:', api.defaults.baseURL);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export default api;
