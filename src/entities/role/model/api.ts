import api from '@/shared/lib/axios';

import type { IRole, IRoleCreateDto, IRoleUpdateDto, IPermission } from './types';

/**
 * Role API functions
 * Endpoints from ADMIN_STAFF_MANAGEMENT.md
 */

export const roleApi = {
  /**
   * Get all roles
   */
  getAllRoles: async (): Promise<IRole[]> => {
    const response = await api.get<IRole[]>('/admin/staff/roles');
    return response.data;
  },

  /**
   * Get role by ID with details
   */
  getRoleById: async (id: number): Promise<IRole> => {
    const response = await api.get<IRole>(`/admin/staff/roles/${id}`);
    return response.data;
  },

  /**
   * Create custom role
   */
  createRole: async (data: IRoleCreateDto): Promise<IRole> => {
    const response = await api.post<IRole>('/admin/staff/roles', data);
    return response.data;
  },

  /**
   * Update role
   */
  updateRole: async (id: number, data: IRoleUpdateDto): Promise<IRole> => {
    const response = await api.patch<IRole>(`/admin/staff/roles/${id}`, data);
    return response.data;
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
    const response = await api.get<IPermission[]>('/admin/staff/permissions');
    return response.data;
  },

  /**
   * Get permissions grouped by category
   */
  getPermissionsGrouped: async (): Promise<Record<string, IPermission[]>> => {
    const response = await api.get<Record<string, IPermission[]>>(
      '/admin/staff/permissions/grouped'
    );
    return response.data;
  }
};
