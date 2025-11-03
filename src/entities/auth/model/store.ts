import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { create } from 'zustand';

import { authApi } from '@/entities/auth/model/api';

import type { IEmployee } from '@/entities/employee';


interface AuthState {
  user: IEmployee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;

  // Actions
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  me: () => void;
  setUser: (user: IEmployee) => void;
}

// Create the auth model
export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login action
  login: async (phone: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await authApi.login({
        phone,
        password
      });

      // Extract token from nested structure
      const accessToken = response.data?.accessToken;

      set({
        token: accessToken,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: any) {
      // Handle error
      set({
        isLoading: false,
        error:
          error.response?.data?.message || 'Failed to login. Please try again.'
      });
      throw error;
    }
  },

  // Logout action
  logout: () => {
    // Remove all tokens and expiration from cookies
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('token_expires_at');

    // Reset all auth state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/sign-in';
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  me: async () => {
    try {
      const myProfile = await authApi.myProfile();

      set({
        user: myProfile
      });
    } catch (error: any) {
      // Don't show toast for 401 errors (handled by axios interceptor)
      if (error?.response?.status !== 401) {
        toast.error('Не удалось получить данные о вас');
      }

      // Clear user state on any error (401 redirect handled by axios interceptor)
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });

      throw error;
    }
  },

  setUser: (user: IEmployee) => {
    set({ user });
  }
}));
