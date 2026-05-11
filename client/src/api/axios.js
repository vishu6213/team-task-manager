import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // Use localhost ONLY if we are in Vite development mode AND on a local hostname
  if (import.meta.env.DEV && window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // Default to production Render API
  return 'https://team-task-manager-ag7w.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 seconds for Render free tier wake-up
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
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Connectivity Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    return Promise.reject(error);
  }
);

export default api;
