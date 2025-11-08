import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { create } from 'zustand'

import { authApi } from '@/entities/auth/model/api'
import { useBranchStore } from '@/entities/branch'

import type { IEmployee } from '@/entities/employee'


interface AuthState {
  user: IEmployee | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  token: string | null

  // Actions
  login: (phone: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  me: () => void
  setUser: (user: IEmployee) => void
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
      set({ isLoading: true, error: null })

      const response = await authApi.login({
        phone,
        password,
      })

      // Extract token from nested structure
      const accessToken = response.data?.accessToken

      set({
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error: unknown) {
      // Handle error
      let errorMessage = 'Failed to login. Please try again.'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as Record<string, unknown>).response === 'object' &&
        (error as Record<string, unknown>).response !== null
      ) {
        const response = (error as Record<string, unknown>).response as Record<
          string,
          unknown
        >
        if (
          'data' in response &&
          typeof response.data === 'object' &&
          response.data !== null
        ) {
          const data = response.data as Record<string, unknown>
          if ('message' in data && typeof data.message === 'string') {
            errorMessage = data.message
          }
        }
      }
      set({
        isLoading: false,
        error: errorMessage,
      })
      throw error
    }
  },

  // Logout action
  logout: () => {
    // Remove all tokens and expiration from cookies
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    Cookies.remove('token_expires_at')

    // Clear branch selection
    useBranchStore.getState().clearSelectedBranch()

    // Reset all auth state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/sign-in'
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },

  me: async () => {
    try {
      const myProfile = await authApi.myProfile()

      set({
        user: myProfile,
      })
    } catch (error: unknown) {
      // Don't show toast for 401 errors (handled by axios interceptor)
      let is401 = false
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const errorObj = error as Record<string, unknown>
        const response = errorObj.response
        if (
          typeof response === 'object' &&
          response !== null &&
          'status' in response
        ) {
          const responseObj = response as Record<string, unknown>
          is401 = responseObj.status === 401
        }
      }

      if (!is401) {
        toast.error('Не удалось получить данные о вас')
      }

      // Clear user state on any error (401 redirect handled by axios interceptor)
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })

      throw error
    }
  },

  setUser: (user: IEmployee) => {
    set({ user })
  },
}))
