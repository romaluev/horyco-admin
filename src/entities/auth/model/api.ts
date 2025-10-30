import {
  AuthRequest,
  AuthResponse,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  CompleteRegistrationRequest,
  CompleteRegistrationResponse
} from '.';
import Cookies from 'js-cookie';
import api from '@/shared/lib/axios';
import { IEmployee } from '@/entities/employee';

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
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    console.log('Login response:', response.data);

    // Store tokens from nested data structure
    if (response.data.success && response.data.data) {
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;

      console.log('Saving access token:', accessToken);
      console.log('Saving refresh token:', refreshToken);

      Cookies.set('access_token', accessToken, {
        expires: 7, // 7 days
        secure: false, // Changed to false for localhost
        sameSite: 'lax'
      });

      Cookies.set('refresh_token', refreshToken, {
        expires: 7,
        secure: false, // Changed to false for localhost
        sameSite: 'lax'
      });

      // Verify cookie was set
      console.log('Cookie after setting:', Cookies.get('access_token'));
    } else {
      console.error('Login response structure is wrong:', response.data);
    }

    return response.data;
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
    );
    return response.data;
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
    );
    return response.data;
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
    );

    console.log('Registration response:', response.data);

    // Store tokens from nested data structure
    if (response.data.success && response.data.data) {
      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;

      console.log('Saving access token:', accessToken);

      Cookies.set('access_token', accessToken, {
        expires: 7,
        secure: false, // Changed to false for localhost
        sameSite: 'lax'
      });

      Cookies.set('refresh_token', refreshToken, {
        expires: 7,
        secure: false, // Changed to false for localhost
        sameSite: 'lax'
      });

      console.log('Cookie after setting:', Cookies.get('access_token'));
    }

    return response.data;
  },

  myProfile: async (): Promise<IEmployee> => {
    const response = await api.get<IEmployee>('/auth/me');
    return response.data;
  },

  updateProfile: async (
    employeeData: Partial<IEmployee>
  ): Promise<IEmployee> => {
    const response = await api.post<IEmployee>(
      '/dashboard/profile',
      employeeData
    );
    return response.data;
  },

  attachAvatar: async (file: File): Promise<IEmployee> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.postForm<IEmployee>(
      '/dashboard/profile/attach-avatar',
      formData
    );
    return response.data;
  }
};
