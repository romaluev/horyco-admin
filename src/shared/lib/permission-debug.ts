/**
 * Debug utilities for permission system
 */

export function debugPermissions(user: any) {
  if (typeof window === 'undefined') return

  console.group('🔐 Permission Debug Info')
  console.log('User ID:', user?.id)
  console.log('User Phone:', user?.phone)
  console.log('Tenant ID:', user?.tenantId)
  console.log('Branch Permissions:', user?.branchPermissions)

  if (user?.branchPermissions) {
    Object.entries(user.branchPermissions).forEach(([branchId, perms]: any) => {
      console.log(
        `  Branch ${branchId}: ${(perms as string[]).length} permissions`
      )
      console.log(
        `    - Can view menu:`,
        (perms as string[]).includes('menu:view')
      )
      console.log(
        `    - Can create menu:`,
        (perms as string[]).includes('menu:create')
      )
      console.log(
        `    - Can view staff:`,
        (perms as string[]).includes('staff:view')
      )
    })
  }
  console.groupEnd()
}
