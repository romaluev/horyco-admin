import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { login } from '@/api/auth';

// Define the User type
export interface IUser {
  id: string;
  username: string;
  email: string;
  fullName?: string;
}

// Define the AuthState type
interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create the auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (phone: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const { user, access_token } = await login({
            phone,
            password
          });

          set({
            token: access_token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error: any) {
          // Handle error
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              'Failed to login. Please try again.'
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        // Remove token from cookies
        Cookies.remove('access_token');

        // Reset state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
