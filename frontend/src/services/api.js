import axios from 'axios';

// Base API configuration
// In development, Vite proxy will forward /api to http://localhost:3000
// In production, set VITE_API_BASE_URL environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-User-Id': 'assessment-user'
  }
});

// Request interceptor (optional - for adding auth tokens, etc.)
api.interceptors.request.use(
  (config) => {
    // Add any request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (optional - for error handling)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({ error: { message: 'Network error', code: 'NETWORK_ERROR' } });
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export default api;
