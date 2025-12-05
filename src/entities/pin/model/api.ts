/**
 * PIN Management API Client
 * Based on ADMIN_PIN_MANAGEMENT.md specification
 *
 * All endpoints under /auth (not /admin)
 */

import Cookies from 'js-cookie'

import api from '@/shared/lib/axios'

import type { IPinGenerateResponse, IPinStatusResponse, IPinLoginResponse } from './types'

/**
 * API Response wrapper from backend
 */
interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

/**
 * Generate PIN for an employee
 * Requires admin/manager permissions
 * PIN shown only once in response
 *
 * @param employeeId - ID of employee to generate PIN for
 * @returns Promise with PIN and expiration date
 */
export const generatePin = async (
  employeeId: number
): Promise<IPinGenerateResponse> => {
  const response = await api.post<ApiResponse<IPinGenerateResponse>>(
    '/auth/generate-pin',
    {
      employeeId,
    }
  )
  return response.data.data
}

/**
 * Refresh own PIN (self-service)
 * Requires current password for security
 *
 * @param currentPassword - Employee's current password
 * @returns Promise with new PIN and expiration date
 */
export const refreshOwnPin = async (
  currentPassword: string
): Promise<IPinGenerateResponse> => {
  const response = await api.post<ApiResponse<IPinGenerateResponse>>(
    '/auth/refresh-pin',
    {
      currentPassword,
    }
  )
  return response.data.data
}

/**
 * Get PIN status for an employee
 * Rate limited to prevent enumeration attacks
 *
 * @param employeeId - ID of employee
 * @returns Promise with PIN status information
 */
export const getPinStatus = async (
  employeeId: number
): Promise<IPinStatusResponse> => {
  const response = await api.get<ApiResponse<IPinStatusResponse>>(
    `/auth/pin-status/${employeeId}`
  )
  return response.data.data
}

/**
 * Enable/Disable PIN authentication
 * Done via employee update endpoint
 *
 * @param employeeId - ID of employee
 * @param enabled - Whether to enable PIN
 */
export const togglePinEnabled = async (
  employeeId: number,
  enabled: boolean
): Promise<IPinStatusResponse> => {
  const response = await api.patch<ApiResponse<IPinStatusResponse>>(
    `/admin/staff/employees/${employeeId}`,
    {
      pinEnabled: enabled,
    }
  )
  return response.data.data
}

/**
 * Login with PIN (for POS)
 * Provides quick authentication for POS terminals
 *
 * @param employeeId - ID of employee logging in
 * @param pin - 4-digit PIN
 * @param branchId - Optional branch ID (required for multi-branch employees)
 * @returns Promise with access token and employee data including branchPermissions
 */
export const pinLogin = async (
  employeeId: number,
  pin: string,
  branchId?: number
): Promise<IPinLoginResponse> => {
  const response = await api.post<IPinLoginResponse>('/auth/pin-login', {
    employeeId,
    pin,
    branchId,
  })

  // Store tokens from response
  if (response.data.accessToken && response.data.expiresIn) {
    const expirationTime = Date.now() + response.data.expiresIn * 1000

    Cookies.set('access_token', response.data.accessToken, {
      expires: 7,
      secure: false,
      sameSite: 'lax',
    })

    if (response.data.refreshToken) {
      Cookies.set('refresh_token', response.data.refreshToken, {
        expires: 7,
        secure: false,
        sameSite: 'lax',
      })
    }

    Cookies.set('token_expires_at', String(expirationTime), {
      expires: 7,
      secure: false,
      sameSite: 'lax',
    })
  }

  return response.data
}
