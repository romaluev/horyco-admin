/**
 * Centralized Token Management
 * Single source of truth for all token operations
 */

import Cookies from 'js-cookie'

// ============================================================================
// Configuration
// ============================================================================

const COOKIE_OPTIONS = {
  expires: 7,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
}

const TOKEN_EXPIRY_BUFFER_MS = 2 * 60 * 1000 // Refresh 2 minutes before expiry

export const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  EXPIRES_AT: 'token_expires_at',
} as const

// ============================================================================
// Token Getters
// ============================================================================

export const getAccessToken = (): string | undefined => Cookies.get(TOKEN_KEYS.ACCESS)

export const getRefreshToken = (): string | undefined => Cookies.get(TOKEN_KEYS.REFRESH)

export const getTokenExpiresAt = (): number | null => {
  const expiresAt = Cookies.get(TOKEN_KEYS.EXPIRES_AT)
  if (!expiresAt) return null

  const parsed = parseInt(expiresAt, 10)
  return isNaN(parsed) ? null : parsed
}

export const hasValidTokens = (): boolean => {
  return !!getAccessToken() && !!getRefreshToken()
}

export const isTokenExpiringSoon = (): boolean => {
  const expirationTime = getTokenExpiresAt()
  if (!expirationTime) return false

  return Date.now() + TOKEN_EXPIRY_BUFFER_MS >= expirationTime
}

// ============================================================================
// Token Storage
// ============================================================================

export const storeTokens = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void => {
  if (!accessToken || !refreshToken || typeof expiresIn !== 'number') {
    console.error('[TokenManager] Invalid tokens:', {
      accessToken: accessToken ? 'valid' : 'MISSING',
      refreshToken: refreshToken ? 'valid' : 'MISSING',
      expiresIn,
    })
    throw new Error('Cannot store invalid tokens')
  }

  const expirationTime = Date.now() + expiresIn * 1000

  Cookies.set(TOKEN_KEYS.ACCESS, accessToken, COOKIE_OPTIONS)
  Cookies.set(TOKEN_KEYS.REFRESH, refreshToken, COOKIE_OPTIONS)
  Cookies.set(TOKEN_KEYS.EXPIRES_AT, String(expirationTime), COOKIE_OPTIONS)
}

export const clearTokens = (): void => {
  Cookies.remove(TOKEN_KEYS.ACCESS)
  Cookies.remove(TOKEN_KEYS.REFRESH)
  Cookies.remove(TOKEN_KEYS.EXPIRES_AT)
}

// ============================================================================
// Token Refresh
// ============================================================================

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

export const isRefreshInProgress = (): boolean => isRefreshing

export const refreshAccessToken = async (apiUrl: string): Promise<string> => {
  // Return existing promise if refresh already in progress (prevents race conditions)
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

      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`)
      }

      const responseData = await response.json()

      // Handle both wrapped { data: {...} } and flat response structures
      const tokenData = responseData.data ?? responseData
      const { accessToken, refreshToken: newRefreshToken, expiresIn } = tokenData

      storeTokens(accessToken, newRefreshToken, expiresIn)

      return accessToken
    } catch (error) {
      clearTokens()
      throw error
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}
