/**
 * Centralized Token Management
 * Single source of truth for token operations
 */

import Cookies from 'js-cookie'

const COOKIE_OPTIONS = {
  expires: 7,
  secure: false, // Set to true in production with HTTPS
  sameSite: 'lax' as const,
}

/**
 * Token storage keys
 */
export const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EXPIRES_AT: 'token_expires_at',
} as const

/**
 * Get access token from cookies
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEYS.ACCESS)
}

/**
 * Get refresh token from cookies
 */
export const getRefreshToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEYS.REFRESH)
}

/**
 * Get token expiration time
 */
export const getTokenExpiresAt = (): number | null => {
  const expiresAt = Cookies.get(TOKEN_KEYS.EXPIRES_AT)
  if (!expiresAt) return null
  const parsed = parseInt(expiresAt, 10)
  return isNaN(parsed) ? null : parsed
}

/**
 * Store all tokens
 */
export const storeTokens = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void => {
  const expirationTime = Date.now() + expiresIn * 1000

  Cookies.set(TOKEN_KEYS.ACCESS, accessToken, COOKIE_OPTIONS)
  Cookies.set(TOKEN_KEYS.REFRESH, refreshToken, COOKIE_OPTIONS)
  Cookies.set(TOKEN_KEYS.EXPIRES_AT, String(expirationTime), COOKIE_OPTIONS)
}

/**
 * Clear all tokens - used on logout or refresh failure
 */
export const clearTokens = (): void => {
  Cookies.remove(TOKEN_KEYS.ACCESS)
  Cookies.remove(TOKEN_KEYS.REFRESH)
  Cookies.remove(TOKEN_KEYS.EXPIRES_AT)
}

/**
 * Check if token is expired or will expire soon (within 2 minutes)
 */
export const isTokenExpiringSoon = (): boolean => {
  const expirationTime = getTokenExpiresAt()
  if (!expirationTime) return false

  const currentTime = Date.now()
  const twoMinutesInMs = 2 * 60 * 1000

  return currentTime + twoMinutesInMs >= expirationTime
}

/**
 * Check if user has valid tokens
 */
export const hasValidTokens = (): boolean => {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  return !!accessToken && !!refreshToken
}

// Singleton flags for token refresh to prevent race conditions
let isRefreshing = false
let refreshPromise: Promise<string> | null = null

/**
 * Refresh access token using refresh token
 * Handles concurrent refresh requests with singleton pattern
 */
export const refreshAccessToken = async (apiUrl: string): Promise<string> => {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true

  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      console.log('[TokenManager] Refreshing access token...')

      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`)
      }

      const data = await response.json()
      const {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn,
      } = data

      storeTokens(accessToken, newRefreshToken, expiresIn)

      console.log('[TokenManager] Token refreshed successfully')
      return accessToken
    } catch (error) {
      console.error('[TokenManager] Failed to refresh token:', error)
      clearTokens()
      throw error
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/**
 * Check if refresh is currently in progress
 */
export const isRefreshInProgress = (): boolean => isRefreshing
