import Cookies from 'js-cookie'

import api from '@/shared/lib/axios'

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
} from '.'
import type { IEmployee } from '@/entities/employee'

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
 * Helper function to store tokens with expiration time
 */
const storeTokens = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void => {
  const expirationTime = Date.now() + expiresIn * 1000 // Convert to milliseconds

  Cookies.set('access_token', accessToken, {
    expires: 7, // 7 days
    secure: false, // Changed to false for localhost
    sameSite: 'lax',
  })

  Cookies.set('refresh_token', refreshToken, {
    expires: 7,
    secure: false, // Changed to false for localhost
    sameSite: 'lax',
  })

  // Store token expiration time
  Cookies.set('token_expires_at', String(expirationTime), {
    expires: 7,
    secure: false,
    sameSite: 'lax',
  })
}

/**
 * Authentication API functions
 */

/**
 * Login with phone and password
 * @param credentials - The login credentials (phone and password)
 * @returns Promise with the authentication response
 */
export const authApi = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)

    console.log('Login response:', response.data)

    // Store tokens from nested data structure
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken, expiresIn } = response.data.data

      console.log('Saving access token:', accessToken)
      console.log('Saving refresh token:', refreshToken)
      console.log('Token expires in:', expiresIn, 'seconds')

      storeTokens(accessToken, refreshToken, expiresIn)

      // Verify cookie was set
      console.log('Cookie after setting:', Cookies.get('access_token'))
    } else {
      console.error('Login response structure is wrong:', response.data)
    }

    return response.data
  },

  /**
   * Refresh access token using refresh token
   * @param data - Refresh token request
   * @returns Promise with new tokens
   */
  refreshToken: async (
    data: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', data)

    const { accessToken, refreshToken, expiresIn } = response.data

    console.log('Refreshing tokens...')
    console.log('New access token:', accessToken)
    console.log('New refresh token:', refreshToken)

    storeTokens(accessToken, refreshToken, expiresIn)

    return response.data
  },

  /**
   * Send OTP code for registration
   * @param data - Phone number and business name
   * @returns Promise with OTP send response
   */
  sendOTP: async (data: SendOTPRequest): Promise<SendOTPResponse> => {
    const response = await api.post<SendOTPResponse>(
      '/auth/register/request-otp',
      data
    )
    return response.data
  },

  /**
   * Verify OTP code (Step 2 of registration)
   * @param data - Phone and OTP code
   * @returns Promise with verification result
   */
  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    const response = await api.post<VerifyOTPResponse>(
      '/auth/register/verify-otp',
      data
    )
    return response.data
  },

  /**
   * Complete registration (Step 3 of registration)
   * @param data - Registration completion data
   * @returns Promise with registration response
   */
  completeRegistration: async (
    data: CompleteRegistrationRequest
  ): Promise<CompleteRegistrationResponse> => {
    const response = await api.post<CompleteRegistrationResponse>(
      '/auth/register/complete',
      data
    )

    console.log('Registration response:', response.data)

    // Store tokens from nested data structure
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken, expiresIn } = response.data.data

      console.log('Saving access token:', accessToken)
      console.log('Saving refresh token:', refreshToken)
      console.log('Token expires in:', expiresIn, 'seconds')

      storeTokens(accessToken, refreshToken, expiresIn)

      console.log('Cookie after setting:', Cookies.get('access_token'))
    }

    return response.data
  },

  myProfile: async (): Promise<IEmployee> => {
    const response = await api.get<IEmployee>('/auth/me')
    return response.data
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
}
