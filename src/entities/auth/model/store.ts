import { toast } from 'sonner'
import { create } from 'zustand'

import { clearTokens } from '@/shared/lib/token-manager'
import { authApi } from '@/entities/auth/model/api'
import { useBranchStore } from '@/entities/branch'

import type { IEmployee } from '@/entities/employee'

interface AuthState {
  user: IEmployee | null
  isAuthenticated: boolean
  isLoading: boolean
  isLoadingProfile: boolean
  error: string | null
  token: string | null

  // Actions
  login: (phone: string, password: string, tenantSlug?: string) => Promise<void>
  logout: () => void
  clearError: () => void
  me: () => Promise<void>
  loadFullProfile: () => Promise<void>
  setUser: (user: IEmployee) => void
  setToken: (token: string | null) => void
}

// Create the auth model
export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isLoadingProfile: false,
  error: null,

  // Login action
  login: async (phone: string, password: string, tenantSlug?: string) => {
    try {
      set({ isLoading: true, error: null })

      const response = await authApi.login({
        phone,
        password,
        tenantSlug,
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
    // Remove all tokens using centralized token manager
    clearTokens()

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
      console.log('[AuthStore] me() called - fetching profile')
      const myProfile = await authApi.myProfile()
      console.log('[AuthStore] me() success - profile loaded')

      set({
        user: myProfile,
      })
    } catch (error: unknown) {
      console.log('[AuthStore] me() error:', error)

      // Check if error is 401 (handled by axios interceptor with token refresh)
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

      console.log('[AuthStore] me() is 401 error:', is401)

      // DEBUG: NOT clearing auth state to investigate logout issue
      // Only clear auth state on 401 errors (token invalid/expired and refresh failed)
      // Other errors (network, 500, etc.) should NOT invalidate the session
      if (is401) {
        console.log('[AuthStore] 401 detected - DEBUG: NOT clearing auth state')
        // set({
        //   user: null,
        //   isAuthenticated: false,
        //   isLoading: false,
        // })
      } else {
        // For non-401 errors, just clear user but keep auth state
        // User can retry the request
        toast.error('Не удалось получить данные о вас')
        set({
          user: null,
          isLoading: false,
        })
      }

      throw error
    }
  },

  loadFullProfile: async () => {
    let isErrorFromMe = false
    try {
      set({ isLoadingProfile: true })

      let currentUser = get().user

      // If user is not loaded yet, fetch basic user data first
      if (!currentUser) {
        try {
          await get().me()
          currentUser = get().user
        } catch (error) {
          // me() already showed error toast, just propagate the error
          isErrorFromMe = true
          throw error
        }
      }

      if (!currentUser?.id) {
        throw new Error('No user ID available')
      }

      const fullProfile = await authApi.getFullProfile(currentUser.id)

      // IMPORTANT: Preserve branchPermissions from /auth/me
      // The /admin/staff/employees/{id} endpoint returns different permission structure
      // We must keep the branchPermissions from /auth/me which has the correct format
      const preservedBranchPermissions = currentUser.branchPermissions

      set({
        user: {
          ...fullProfile,
          branchPermissions: preservedBranchPermissions,
        },
        isLoadingProfile: false,
      })
    } catch (error: unknown) {
      // Only show toast if error is not from me() call
      if (!isErrorFromMe) {
        toast.error('Не удалось загрузить полный профиль')
      }
      set({ isLoadingProfile: false })
      throw error
    }
  },

  setUser: (user: IEmployee) => {
    set({ user })
  },

  setToken: (token: string | null) => {
    set({ token })
  },
}))
