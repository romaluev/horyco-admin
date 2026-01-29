'use client'

import React from 'react'

import {
  useHasPermission,
  useHasAllPermissions,
  useHasAnyPermission,
} from '@/shared/hooks/use-permissions'

interface ProtectedNavItemProps {
  permission?: string
  permissions?: string[]
  permissionMode?: 'all' | 'any'
  children: React.ReactNode
}

/**
 * Wrapper component that only renders children if user has required permission
 * Used to hide navigation items and sections without permission
 */
export const ProtectedNavItem = ({
  permission,
  permissions,
  permissionMode = 'all',
  children,
}: ProtectedNavItemProps) => {
  // Call all hooks unconditionally
  const hasSinglePermission = useHasPermission(permission ?? '')
  const hasAllPermissions = useHasAllPermissions(permissions ?? [])
  const hasAnyPermissions = useHasAnyPermission(permissions ?? [])

  // Determine which result to use based on props
  let hasPermission: boolean
  if (permission) {
    hasPermission = hasSinglePermission
  } else if (permissions && permissionMode === 'all') {
    hasPermission = hasAllPermissions
  } else if (permissions && permissionMode === 'any') {
    hasPermission = hasAnyPermissions
  } else {
    hasPermission = true
  }

  if (!hasPermission) {
    return null
  }

  return <>{children}</>
}

interface ProtectedContentProps extends ProtectedNavItemProps {}

/**
 * Alias for ProtectedNavItem for more semantic naming in content areas
 */
export const ProtectedContent = (props: ProtectedContentProps) => (
  <ProtectedNavItem {...props} />
)
