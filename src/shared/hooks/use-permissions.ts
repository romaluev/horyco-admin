'use client'

import {
  hasPermissionAnyBranch,
  hasAllPermissionsAnyBranch,
  hasAnyPermissionAnyBranch,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getBranchesWithPermission,
} from '@/shared/lib/permissions'

import { useAuthStore } from '@/entities/auth'

/**
 * Hook to check if user has a permission at ANY branch (Admin Panel mode)
 * Use this for most admin panel features
 */
export function useHasPermission(permission: string): boolean {
  const user = useAuthStore((state) => state.user)

  if (!permission || !user?.branchPermissions) return false

  return hasPermissionAnyBranch(user.branchPermissions, permission)
}

/**
 * Hook to check if user has all permissions at ANY branch (Admin Panel mode)
 */
export function useHasAllPermissions(permissions: string[]): boolean {
  const user = useAuthStore((state) => state.user)

  if (!user?.branchPermissions) return false

  return hasAllPermissionsAnyBranch(user.branchPermissions, permissions)
}

/**
 * Hook to check if user has any of the given permissions at ANY branch (Admin Panel mode)
 */
export function useHasAnyPermission(permissions: string[]): boolean {
  const user = useAuthStore((state) => state.user)

  if (!user?.branchPermissions) return false

  return hasAnyPermissionAnyBranch(user.branchPermissions, permissions)
}

/**
 * Hook to check if user has a permission for a specific branch
 * Use this for POS operations where branch context matters
 */
export function useHasPermissionForBranch(
  permission: string,
  branchId?: string | number
): boolean {
  const user = useAuthStore((state) => state.user)

  if (!user?.branchPermissions || !branchId) return false

  return hasPermission(user.branchPermissions, branchId, permission)
}

/**
 * Hook to check if user has all permissions for a specific branch
 */
export function useHasAllPermissionsForBranch(
  permissions: string[],
  branchId?: string | number
): boolean {
  const user = useAuthStore((state) => state.user)

  if (!user?.branchPermissions || !branchId) return false

  return hasAllPermissions(user.branchPermissions, branchId, permissions)
}

/**
 * Hook to check if user has any of the given permissions for a specific branch
 */
export function useHasAnyPermissionForBranch(
  permissions: string[],
  branchId?: string | number
): boolean {
  const user = useAuthStore((state) => state.user)

  if (!user?.branchPermissions || !branchId) return false

  return hasAnyPermission(user.branchPermissions, branchId, permissions)
}

/**
 * Hook to get all branches where user has a specific permission
 */
export function useGetBranchesWithPermission(permission: string): string[] {
  const user = useAuthStore((state) => state.user)

  if (!user?.branchPermissions) return []

  return getBranchesWithPermission(user.branchPermissions, permission)
}

/**
 * Hook to check if user is owner (has wildcard permission)
 */
export function useIsOwner(): boolean {
  const user = useAuthStore((state) => state.user)

  if (!user?.branchPermissions) return false

  return Object.values(user.branchPermissions).some((permissions) => {
    return Array.isArray(permissions) && permissions.includes('*')
  })
}

/**
 * Hook to check required permission and throw if not available
 * For components that should not render at all if permission missing
 */
export function useRequirePermission(permission: string): boolean {
  const hasPermissionResult = useHasPermission(permission)

  if (!hasPermissionResult) {
    console.warn(
      `Component requires permission "${permission}" but user does not have it`
    )
  }

  return hasPermissionResult
}

/**
 * Hook to check multiple required permissions and throw if not all available
 */
export function useRequireAllPermissions(permissions: string[]): boolean {
  const hasPermissionsResult = useHasAllPermissions(permissions)

  if (!hasPermissionsResult) {
    console.warn(
      `Component requires permissions "${permissions.join(
        ', '
      )}" but user does not have all of them`
    )
  }

  return hasPermissionsResult
}
