import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isLocalPage = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // If we have an ENV URL and it's either not localhost OR we are actually on a local page
  if (envUrl && (!envUrl.includes('localhost') || isLocalPage)) {
    return envUrl;
  }
  
  // If we are on a local page and in dev mode, default to local server
  if (isLocalPage && import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  
  // Default to production Render API for all other cases (especially Vercel production)
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
    // Log the actual request being made for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
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
