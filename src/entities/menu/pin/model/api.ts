/**
 * PIN Management API
 */

import api from '@/shared/lib/axios'
import { storeTokens } from '@/shared/lib/token-manager'

import type {
  IPinGenerateResponse,
  IPinStatusResponse,
  IPinLoginResponse,
} from './types'

// ============================================================================
// Types
// ============================================================================

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

// ============================================================================
// PIN API
// ============================================================================

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

export const getPinStatus = async (
  employeeId: number
): Promise<IPinStatusResponse> => {
  const response = await api.get<ApiResponse<IPinStatusResponse>>(
    `/auth/pin-status/${employeeId}`
  )
  return response.data.data
}

export const togglePinEnabled = async (
  employeeId: number,
  enabled: boolean
): Promise<IPinStatusResponse> => {
  const response = await api.patch<ApiResponse<IPinStatusResponse>>(
    `/admin/staff/employees/${employeeId}`,
    { pinEnabled: enabled }
  )
  return response.data.data
}

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

  const { accessToken, refreshToken, expiresIn } = response.data

  if (accessToken && refreshToken && expiresIn) {
    storeTokens(accessToken, refreshToken, expiresIn)
  }

  return response.data
}
