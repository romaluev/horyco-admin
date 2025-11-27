/**
 * PIN Management API Client
 * Based on ADMIN_PIN_MANAGEMENT.md specification
 *
 * All endpoints under /auth (not /admin)
 */

import api from '@/shared/lib/axios'

import type { IPinGenerateResponse, IPinStatusResponse } from './types'

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
  const response = await api.post<IPinGenerateResponse>('/auth/generate-pin', {
    employeeId,
  })
  return response.data
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
  const response = await api.post<IPinGenerateResponse>('/auth/refresh-pin', {
    currentPassword,
  })
  return response.data
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
): Promise<void> => {
  await api.patch(`/admin/staff/employees/${employeeId}`, {
    pinEnabled: enabled,
  })
}
