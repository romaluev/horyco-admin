/**
 * Axios HTTP Client with automatic token management
 */

import axios from 'axios'

import {
  getAccessToken,
  clearTokens,
  isTokenExpiringSoon,
  refreshAccessToken,
} from '@/shared/lib/token-manager'

import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

// ============================================================================
// Configuration
// ============================================================================

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL

const AUTH_ENDPOINTS = ['/auth/login', '/auth/refresh', '/auth/register']

const isAuthEndpoint = (url?: string): boolean =>
  AUTH_ENDPOINTS.some((endpoint) => url?.includes(endpoint))

// ============================================================================
// Auth Store Access (lazy import to avoid circular dependency)
// ============================================================================

interface AuthStore {
  setToken?: (token: string | null) => void
  logout?: () => void
}

let authStoreGetter: (() => AuthStore) | null = null

const getAuthStore = (): AuthStore | null => {
  try {
    if (!authStoreGetter) {
      // Dynamic require to avoid circular dependency
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      authStoreGetter = require('@/entities/auth').useAuthStore
    }
    return authStoreGetter?.() ?? null
  } catch {
    return null
  }
}

const syncTokenToStore = (token: string): void => {
  getAuthStore()?.setToken?.(token)
}

// ============================================================================
// Logout Handler
// ============================================================================

let isRedirectingToLogin = false

const logoutAndRedirect = (): void => {
  if (typeof window === 'undefined' || isRedirectingToLogin) return

  isRedirectingToLogin = true

  const authStore = getAuthStore()
  if (authStore?.logout) {
    authStore.logout()
  } else {
    clearTokens()
    if (!window.location.href.includes('/auth/sign')) {
      window.location.href = '/auth/sign-in'
    }
  }
}

// ============================================================================
// Axios Instance
// ============================================================================

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// ============================================================================
// Request Interceptor
// ============================================================================

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (isAuthEndpoint(config.url)) {
      return config
    }

    let token = getAccessToken()

    // Proactively refresh token if expiring soon
    if (token && isTokenExpiringSoon()) {
      try {
        token = await refreshAccessToken(BASE_API_URL ?? '')
        syncTokenToStore(token)
      } catch {
        return Promise.reject(new Error('Token refresh failed'))
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ============================================================================
// Response Interceptor
// ============================================================================

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest

    const shouldRetry =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)

    if (shouldRetry) {
      originalRequest._retry = true

      try {
        const newToken = await refreshAccessToken(BASE_API_URL ?? '')
        syncTokenToStore(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch {
        logoutAndRedirect()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
