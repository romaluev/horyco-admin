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
  let hasPermission: boolean

  if (permission) {
    hasPermission = useHasPermission(permission)
  } else if (permissions && permissionMode === 'all') {
    hasPermission = useHasAllPermissions(permissions)
  } else if (permissions && permissionMode === 'any') {
    hasPermission = useHasAnyPermission(permissions)
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
