import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Authorization token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('warranty_tracker_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiry handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      if (localStorage.getItem('warranty_tracker_token')) {
        localStorage.removeItem('warranty_tracker_token');
        localStorage.removeItem('warranty_tracker_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
