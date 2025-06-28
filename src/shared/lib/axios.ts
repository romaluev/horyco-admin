import axios from 'axios';
import Cookies from 'js-cookie';

// In Next.js, NEXT_PUBLIC_ variables are inlined during build time
// This means the actual value replaces the reference at build time
// and no reference to `process` remains in the client bundle
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const BASE_API_URL = NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    credentials: 'include'
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
        if (!window.location.href.includes('/auth/sign')) {
          window.location.href = '/auth/sign-in';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Export the axios instance as default
export default api;
