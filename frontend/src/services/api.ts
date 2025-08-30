import axios from 'axios';

const api = axios.create({
  // All API calls will now be relative to the root URL (e.g., /api/v1/...)
  baseURL: '/api/v1',
});

// This interceptor automatically adds the auth token to every request
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

export default api;