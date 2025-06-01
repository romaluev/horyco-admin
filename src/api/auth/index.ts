import api from '../index';
import { AuthRequest, AuthResponse } from './types';
import Cookies from 'js-cookie';

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

/**
 * Logout the current user
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

/**
 * Check if the user is authenticated
 * @returns boolean indicating if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
};

/**
 * Get the current authentication token
 * @returns The current token or null if not authenticated
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export default {
  login,
  logout,
  isAuthenticated,
  getToken
};
