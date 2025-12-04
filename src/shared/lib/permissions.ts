/**
 * Permission checking utilities
 * Works with the branchPermissions map format: { branchId: [permission:names] }
 */

/**
 * Check if user has a specific permission for a branch
 * @param branchPermissions - Map of branchId to permission arrays
 * @param branchId - The branch to check
 * @param permission - The permission to check (e.g., "orders:view", "menu:edit")
 * @returns true if user has the permission for this branch
 */
export function hasPermission(
  branchPermissions: Record<string, string[]> | undefined,
  branchId: string | number,
  permission: string
): boolean {
  if (!branchPermissions) return false

  const branchIdStr = String(branchId)
  const permissions = branchPermissions[branchIdStr]

  if (!permissions || !Array.isArray(permissions)) return false

  // Check for wildcard permission (full access)
  if (permissions.includes('*')) return true

  // Check for specific permission
  return permissions.includes(permission)
}

/**
 * Check if user has any of the given permissions for a branch
 * @param branchPermissions - Map of branchId to permission arrays
 * @param branchId - The branch to check
 * @param permissions - Array of permissions to check
 * @returns true if user has any of the permissions
 */
export function hasAnyPermission(
  branchPermissions: Record<string, string[]> | undefined,
  branchId: string | number,
  permissions: string[]
): boolean {
  return permissions.some((perm) =>
    hasPermission(branchPermissions, branchId, perm)
  )
}

/**
 * Check if user has all of the given permissions for a branch
 * @param branchPermissions - Map of branchId to permission arrays
 * @param branchId - The branch to check
 * @param permissions - Array of permissions to check
 * @returns true if user has all of the permissions
 */
export function hasAllPermissions(
  branchPermissions: Record<string, string[]> | undefined,
  branchId: string | number,
  permissions: string[]
): boolean {
  return permissions.every((perm) =>
    hasPermission(branchPermissions, branchId, perm)
  )
}

/**
 * Get all permissions for a specific branch
 * @param branchPermissions - Map of branchId to permission arrays
 * @param branchId - The branch to get permissions for
 * @returns Array of permissions for the branch
 */
export function getBranchPermissions(
  branchPermissions: Record<string, string[]> | undefined,
  branchId: string | number
): string[] {
  if (!branchPermissions) return []

  const branchIdStr = String(branchId)
  return branchPermissions[branchIdStr] || []
}

/**
 * Check if user has full access (wildcard permission)
 * @param branchPermissions - Map of branchId to permission arrays
 * @param branchId - The branch to check
 * @returns true if user has wildcard permission (*) for this branch
 */
export function hasFullAccess(
  branchPermissions: Record<string, string[]> | undefined,
  branchId: string | number
): boolean {
  return hasPermission(branchPermissions, branchId, '*')
}

/**
 * Get branches where user has a specific permission
 * @param branchPermissions - Map of branchId to permission arrays
 * @param permission - The permission to search for
 * @returns Array of branchIds where user has this permission
 */
export function getBranchesWithPermission(
  branchPermissions: Record<string, string[]> | undefined,
  permission: string
): string[] {
  if (!branchPermissions) return []

  return Object.entries(branchPermissions)
    .filter(([_, permissions]) => {
      if (!Array.isArray(permissions)) return false
      return permissions.includes('*') || permissions.includes(permission)
    })
    .map(([branchId]) => branchId)
}

/**
 * Common permission names (for reference/autocomplete)
 */
export const PERMISSIONS = {
  // Orders
  ORDERS_CREATE: 'orders:create',
  ORDERS_VIEW: 'orders:view',
  ORDERS_EDIT: 'orders:edit',
  ORDERS_DELETE: 'orders:delete',

  // Menu
  MENU_CREATE: 'menu:create',
  MENU_VIEW: 'menu:view',
  MENU_EDIT: 'menu:edit',
  MENU_DELETE: 'menu:delete',
  MENU_MANAGE: 'menu:manage',

  // Staff
  STAFF_CREATE: 'staff:create',
  STAFF_VIEW: 'staff:view',
  STAFF_EDIT: 'staff:edit',
  STAFF_DELETE: 'staff:delete',
  STAFF_MANAGE: 'staff:manage',

  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',

  // Finance
  FINANCE_VIEW: 'finance:view',
  FINANCE_REFUND: 'finance:refund',

  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',

  // Payments
  PAYMENTS_CREATE: 'payments:create',
  PAYMENTS_VIEW: 'payments:view',
  PAYMENTS_EDIT: 'payments:edit',
  PAYMENTS_DELETE: 'payments:delete',

  // Tables
  TABLES_VIEW: 'tables:view',
  TABLES_MANAGE: 'tables:manage',

  // Customers
  CUSTOMERS_VIEW: 'customers:view',
  CUSTOMERS_MANAGE: 'customers:manage',

  // Wildcard (full access)
  ALL: '*',
} as const
