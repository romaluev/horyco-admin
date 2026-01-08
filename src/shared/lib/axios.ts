import axios from 'axios'

import {
  getAccessToken,
  clearTokens,
  isTokenExpiringSoon,
  refreshAccessToken,
} from '@/shared/lib/token-manager'

import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

// Lazy import to avoid circular dependency
let useAuthStore: (() => { setToken?: (token: string | null) => void; logout?: () => void }) | null = null
const getAuthStore = (): { setToken?: (token: string | null) => void; logout?: () => void } | null => {
  try {
    if (!useAuthStore) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
      useAuthStore = require('@/entities/auth').useAuthStore
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAuthStore?.() ?? null
  } catch {
    return null
  }
}

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL

// Singleton flag to prevent multiple simultaneous redirects
let isRedirectingToLogin = false

/**
 * Logout user and redirect to login page
 */
const logoutUser = (): void => {
  if (typeof window !== 'undefined' && !isRedirectingToLogin) {
    isRedirectingToLogin = true

    // Use Zustand store logout which handles all cleanup
    const authStore = getAuthStore()
    if (authStore?.logout) {
      authStore.logout()
    } else {
      // Fallback if store not available
      clearTokens()

      if (!window.location.href.includes('/auth/sign')) {
        window.location.href = '/auth/sign-in'
      }
    }
  }
}

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor: Check token expiration and refresh if needed
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token refresh for auth endpoints
    if (
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/refresh') ||
      config.url?.includes('/auth/register')
    ) {
      return config
    }

    // Get current access token
    let token = getAccessToken()

    // Check if token is expiring soon and refresh if needed
    if (token && isTokenExpiringSoon()) {
      try {
        console.log('[Axios] Token expiring soon, refreshing...')
        token = await refreshAccessToken(BASE_API_URL || '')

        // Sync new token with Zustand store
        const authStore = getAuthStore()
        if (authStore?.setToken) {
          authStore.setToken(token)
        }
      } catch (error) {
        console.error('[Axios] Token refresh failed, logging out...')
        logoutUser()
        return Promise.reject(error)
      }
    }

    // Add token to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle 401 errors with token refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Handle 401 Unauthorized errors
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // Skip retry for auth endpoints
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/register')
      ) {
        return Promise.reject(error)
      }

      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true

      try {
        console.log('[Axios] Received 401, attempting token refresh...')

        // Try to refresh the token
        const newAccessToken = await refreshAccessToken(BASE_API_URL || '')

        // Sync new token with Zustand store
        const authStore = getAuthStore()
        if (authStore?.setToken) {
          authStore.setToken(newAccessToken)
        }

        // Update the authorization header with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // Retry the original request with new token
        console.log('[Axios] Retrying original request with new token...')
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout user
        console.error('[Axios] Token refresh failed on 401, logging out...')
        logoutUser()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
