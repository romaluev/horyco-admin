import axios from 'axios';
import authApi from './auth';
import branchesApi from './branches';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', // Default to localhost if not specified
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = Cookies.get('access_token');

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
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      Cookies.remove('access_token');
      window.location.href = '/auth/sigh-in';
    }

    return Promise.reject(error);
  }
);

// Export the API modules
export { authApi, branchesApi };

// Export the axios instance as default
export default api;
