import { AuthRequest, AuthResponse } from '.';
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

    Cookies.set('access_token', response.data.access_token, {
      expires: 7, // 7 days
      secure: true,
      sameSite: 'strict'
    });

    return response.data;
  },

  myProfile: async (): Promise<IEmployee> => {
    const response = await api.get<IEmployee>('/dashboard/profile');
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
