import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../../../environments';

export const BASE_API_URL = config.api_url;

const api = axios.create({
  baseURL: config.api_url || 'http://localhost:3000',
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
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/sign-in';
      }
    }

    return Promise.reject(error);
  }
);

// Export the axios instance as default
export default api;
