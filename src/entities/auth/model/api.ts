import { AuthRequest, AuthResponse } from '.';
import Cookies from 'js-cookie';
import api from '@/shared/lib/axios';

/**
 * Authentication API functions
 */

/**
 * Login with phone and password
 * @param credentials - The login credentials (phone and password)
 * @returns Promise with the authentication response
 */
export const login = async (
  credentials: AuthRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);

  Cookies.set('access_token', response.data.access_token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return response.data;
};
