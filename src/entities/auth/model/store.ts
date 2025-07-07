import { create } from 'zustand';
import Cookies from 'js-cookie';
import { IEmployee } from '@/entities/employee';
import { authApi } from '@/entities/auth/model/api';
import { toast } from 'sonner';

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

      const { access_token } = await authApi.login({
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
          error.response?.data?.message || 'Failed to login. Please try again.'
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
  },

  me: async () => {
    set({ isLoading: true, error: null });

    try {
      const myProfile = await authApi.myProfile();

      set({
        user: myProfile,
        isLoading: false
      });
    } catch (error: any) {
      toast.error('Не удалось получить данные о вас');
      if (error?.response?.status === 401) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        if (!window.location.href.includes('/auth/sign')) {
          window.location.href = '/auth/sign-in';
        }
      }
    }
  },

  setUser: (user: IEmployee) => {
    set({ user });
  }
}));
