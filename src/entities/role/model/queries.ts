import { useQuery } from '@tanstack/react-query'

import { roleApi } from './api'
import { roleKeys } from './query-keys'

/**
 * React Query hooks for role data fetching (READ operations)
 */

/**
 * Get all roles
 */
export const useGetAllRoles = () => {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: () => roleApi.getAllRoles(),
  })
}

/**
 * Get role by ID
 */
export const useGetRoleById = (id: number) => {
  return useQuery({
    queryKey: roleKeys.byId(id),
    queryFn: () => roleApi.getRoleById(id),
    enabled: !!id,
  })
}

/**
 * Get all permissions
 */
export const useGetAllPermissions = () => {
  return useQuery({
    queryKey: roleKeys.permissions(),
    queryFn: () => roleApi.getAllPermissions(),
  })
}

/**
 * Get permissions grouped by category
 */
export const useGetPermissionsGrouped = () => {
  return useQuery({
    queryKey: roleKeys.permissionsGrouped(),
    queryFn: () => roleApi.getPermissionsGrouped(),
  })
}
