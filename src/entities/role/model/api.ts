import api from '@/shared/lib/axios';

import type { IRole, IRoleCreateDto, IRoleUpdateDto, IPermission, IRoleFilters, IPaginatedResponse } from './types';

/**
 * API Response wrapper from backend
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  requestId: string;
}

/**
 * Role API functions
 * Endpoints from ADMIN_STAFF_MANAGEMENT.md
 */

export const roleApi = {
  /**
   * Get all roles with optional pagination
   * @param filters - Optional pagination filters (page, limit)
   * @returns Promise with array of roles or paginated response
   */
  getAllRoles: async (filters?: IRoleFilters): Promise<IRole[] | IPaginatedResponse<IRole>> => {
    const params = new URLSearchParams();

    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }

    const response = await api.get<ApiResponse<IRole[] | IPaginatedResponse<IRole>>>(
      '/admin/staff/roles',
      { params }
    );
    return response.data.data;
  },

  /**
   * Get role by ID with details
   */
  getRoleById: async (id: number): Promise<IRole> => {
    const response = await api.get<ApiResponse<IRole>>(`/admin/staff/roles/${id}`);
    return response.data.data;
  },

  /**
   * Create custom role
   */
  createRole: async (data: IRoleCreateDto): Promise<IRole> => {
    const response = await api.post<ApiResponse<IRole>>('/admin/staff/roles', data);
    return response.data.data;
  },

  /**
   * Update role
   */
  updateRole: async (id: number, data: IRoleUpdateDto): Promise<IRole> => {
    const response = await api.patch<ApiResponse<IRole>>(`/admin/staff/roles/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete role
   */
  deleteRole: async (id: number): Promise<void> => {
    await api.delete(`/admin/staff/roles/${id}`);
  },

  /**
   * Get all permissions
   */
  getAllPermissions: async (): Promise<IPermission[]> => {
    const response = await api.get<ApiResponse<IPermission[]>>('/admin/staff/permissions');
    return response.data.data;
  },

  /**
   * Get permissions grouped by category
   */
  getPermissionsGrouped: async (): Promise<Record<string, IPermission[]>> => {
    const response = await api.get<ApiResponse<Record<string, IPermission[]>>>(
      '/admin/staff/permissions/grouped'
    );
    return response.data.data;
  },

  /**
   * Get system permissions only
   */
  getSystemPermissions: async (): Promise<IPermission[]> => {
    const response = await api.get<ApiResponse<IPermission[]>>('/admin/staff/permissions/system');
    return response.data.data;
  },

  /**
   * Add single permission to role
   */
  addPermissionToRole: async (roleId: number, permissionId: number): Promise<IRole> => {
    const response = await api.post<ApiResponse<IRole>>(
      `/admin/staff/roles/${roleId}/permissions/${permissionId}`
    );
    return response.data.data;
  },

  /**
   * Remove single permission from role
   */
  removePermissionFromRole: async (roleId: number, permissionId: number): Promise<IRole> => {
    const response = await api.delete<ApiResponse<IRole>>(
      `/admin/staff/roles/${roleId}/permissions/${permissionId}`
    );
    return response.data.data;
  },

  /**
   * Replace all permissions in role
   */
  replaceRolePermissions: async (roleId: number, permissionIds: number[]): Promise<IRole> => {
    const response = await api.patch<ApiResponse<IRole>>(
      `/admin/staff/roles/${roleId}/permissions`,
      { permissionIds }
    );
    return response.data.data;
  },
};
