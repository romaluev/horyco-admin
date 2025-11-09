import axios from 'axios'
import Cookies from 'js-cookie'

import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL

// Singleton flags to prevent multiple simultaneous operations
let isRedirectingToLogin = false
let isRefreshing = false
let refreshPromise: Promise<string> | null = null

/**
 * Check if token is expired or will expire soon (within 2 minutes)
 */
const isTokenExpiringSoon = (): boolean => {
  const expiresAt = Cookies.get('token_expires_at')
  if (!expiresAt) return true

  const expirationTime = parseInt(expiresAt, 10)
  const currentTime = Date.now()
  const twoMinutesInMs = 2 * 60 * 1000

  return currentTime + twoMinutesInMs >= expirationTime
}

/**
 * Refresh the access token using the refresh token
 */
const refreshAccessToken = async (): Promise<string> => {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true

  refreshPromise = (async () => {
    try {
      const refreshToken = Cookies.get('refresh_token')

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      console.log('Refreshing access token...')

      // Call refresh endpoint without authorization header
      const response = await axios.post<{
        accessToken: string
        refreshToken: string
        expiresIn: number
      }>(
        `${BASE_API_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn,
      } = response.data
      const expirationTime = Date.now() + expiresIn * 1000

      // Store new tokens
      Cookies.set('access_token', accessToken, {
        expires: 7,
        secure: false,
        sameSite: 'lax',
      })

      Cookies.set('refresh_token', newRefreshToken, {
        expires: 7,
        secure: false,
        sameSite: 'lax',
      })

      Cookies.set('token_expires_at', String(expirationTime), {
        expires: 7,
        secure: false,
        sameSite: 'lax',
      })

      console.log('Token refreshed successfully')

      return accessToken
    } catch (error) {
      console.error('Failed to refresh token:', error)
      // Clear tokens on refresh failure
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      Cookies.remove('token_expires_at')
      throw error
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/**
 * Logout user and redirect to login page
 */
const logoutUser = (): void => {
  if (typeof window !== 'undefined' && !isRedirectingToLogin) {
    isRedirectingToLogin = true

    // Clear all tokens
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    Cookies.remove('token_expires_at')

    // Redirect to login page if not already there
    if (!window.location.href.includes('/auth/sign')) {
      window.location.href = '/auth/sign-in'
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
    let token = Cookies.get('access_token')

    // Check if token is expiring soon and refresh if needed
    if (token && isTokenExpiringSoon()) {
      try {
        console.log('Token expiring soon, refreshing...')
        token = await refreshAccessToken()
      } catch (error) {
        console.error('Token refresh failed, logging out...')
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
        console.log('Received 401, attempting token refresh...')

        // Try to refresh the token
        const newAccessToken = await refreshAccessToken()

        // Update the authorization header with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // Retry the original request with new token
        console.log('Retrying original request with new token...')
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout user
        console.error('Token refresh failed on 401, logging out...')
        logoutUser()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
