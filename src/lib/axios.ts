import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/features/auth/store/auth-store';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth state if we're in a browser environment
      if (typeof window !== 'undefined') {
        // Get the logout function from the auth store
        const logout = useAuthStore.getState().logout;
        logout();

        // Redirect to login page
        if (window.location.pathname !== '/auth/sign-in') {
          // Use Next.js router for navigation in client components
          // For middleware and server components, this is handled separately
          import('next/navigation')
            .then(({ useRouter }) => {
              try {
                const router = useRouter();
                router.push('/auth/sign-in');
              } catch (e) {
                // Fallback if router is not available (e.g., in a non-component context)
                window.location.href = '/auth/sign-in';
              }
            })
            .catch(() => {
              // If Next.js navigation module can't be loaded, use regular navigation
              window.location.href = '/auth/sign-in';
            });
        }
      }
    }

    return Promise.reject(error);
  }
);
