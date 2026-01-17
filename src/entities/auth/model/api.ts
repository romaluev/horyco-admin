/**
 * Authentication API
 */

import api from '@/shared/lib/axios'
import { storeTokens } from '@/shared/lib/token-manager'

import type {
  AuthRequest,
  AuthResponse,
  CompleteRegistrationRequest,
  CompleteRegistrationResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  VerifyInviteRequest,
  VerifyInviteResponse,
  CompleteInviteRequest,
  CompleteInviteResponse,
  VerifyStaffInviteRequest,
  VerifyStaffInviteResponse,
  CompleteStaffInviteRequest,
  CompleteStaffInviteResponse,
} from '.'
import type { IEmployee } from '@/entities/employee'

// ============================================================================
// Types
// ============================================================================

interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  requestId: string
}

interface TokenData {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// ============================================================================
// Helpers
// ============================================================================

const extractTokenData = (response: unknown): TokenData | null => {
  const data = response as { data?: TokenData } & TokenData

  // Handle both wrapped { data: {...} } and flat response
  const tokenData = data.data ?? data

  if (tokenData.accessToken && tokenData.refreshToken && tokenData.expiresIn) {
    return tokenData
  }
  return null
}

const saveTokensFromResponse = (response: unknown): void => {
  const tokenData = extractTokenData(response)
  if (tokenData) {
    storeTokens(tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn)
  }
}

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  // Login
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)

    if (response.data.success && response.data.data) {
      saveTokensFromResponse(response.data.data)
    }

    return response.data
  },

  // Refresh Token
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse | ApiResponse<RefreshTokenResponse>>(
      '/auth/refresh',
      data
    )

    const tokenData = extractTokenData(response.data)
    if (tokenData) {
      storeTokens(tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn)
      return tokenData as RefreshTokenResponse
    }

    return response.data as RefreshTokenResponse
  },

  // Registration Flow
  sendOTP: async (data: SendOTPRequest): Promise<SendOTPResponse> => {
    const response = await api.post<SendOTPResponse>('/auth/register/request-otp', data)
    return response.data
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    const response = await api.post<VerifyOTPResponse>('/auth/register/verify-otp', data)
    return response.data
  },

  completeRegistration: async (
    data: CompleteRegistrationRequest
  ): Promise<CompleteRegistrationResponse> => {
    const response = await api.post<CompleteRegistrationResponse>(
      '/auth/register/complete',
      data
    )

    if (response.data.success && response.data.data) {
      saveTokensFromResponse(response.data.data)
    }

    return response.data
  },

  // Profile
  myProfile: async (): Promise<IEmployee> => {
    const response = await api.get<{ data: IEmployee }>('/auth/me')
    return response.data.data
  },

  getFullProfile: async (employeeId: number): Promise<IEmployee> => {
    const response = await api.get<ApiResponse<IEmployee>>(
      `/admin/staff/employees/${employeeId}`
    )
    return response.data.data
  },

  updateProfile: async (
    employeeData: Partial<IEmployee> & { id: number }
  ): Promise<IEmployee> => {
    const { id, password: _password, ...data } = employeeData
    const response = await api.patch<ApiResponse<IEmployee>>(
      `/admin/staff/employees/${id}`,
      data
    )
    return response.data.data
  },

  // Owner Invite
  verifyInvite: async (data: VerifyInviteRequest): Promise<VerifyInviteResponse> => {
    const response = await api.post<ApiResponse<VerifyInviteResponse>>(
      '/auth/invite/verify',
      data
    )
    return response.data.data
  },

  completeInvite: async (data: CompleteInviteRequest): Promise<CompleteInviteResponse> => {
    const response = await api.post<ApiResponse<CompleteInviteResponse>>(
      '/auth/invite/complete',
      data
    )

    const result = response.data.data
    if (result.success) {
      saveTokensFromResponse(result)
    }

    return result
  },

  // Staff Invite
  verifyStaffInvite: async (
    data: VerifyStaffInviteRequest
  ): Promise<VerifyStaffInviteResponse> => {
    const response = await api.post<ApiResponse<VerifyStaffInviteResponse>>(
      '/auth/staff-invite/verify',
      data
    )
    return response.data.data
  },

  completeStaffInvite: async (
    data: CompleteStaffInviteRequest
  ): Promise<CompleteStaffInviteResponse> => {
    const response = await api.post<ApiResponse<CompleteStaffInviteResponse>>(
      '/auth/staff-invite/complete',
      data
    )

    const result = response.data.data
    if (result.success) {
      saveTokensFromResponse(result)
    }

    return result
  },
}
