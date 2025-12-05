'use client'

import React from 'react'
import { type ComponentProps } from 'react'

import {
  useHasPermission,
  useHasAllPermissions,
  useHasAnyPermission,
} from '@/shared/hooks/use-permissions'
import { Button } from '@/shared/ui/base/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/base/tooltip'

interface ProtectedButtonProps extends ComponentProps<typeof Button> {
  permission?: string
  permissions?: string[]
  permissionMode?: 'all' | 'any'
  fallback?: React.ReactNode
  tooltipOnDenied?: boolean
  deniedTooltip?: string
}

export const ProtectedButton = React.forwardRef<
  HTMLButtonElement,
  ProtectedButtonProps
>(
  (
    {
      permission,
      permissions,
      permissionMode = 'all',
      fallback = null,
      tooltipOnDenied = true,
      deniedTooltip,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
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
      if (!tooltipOnDenied) {
        return fallback
      }

      const tooltip =
        deniedTooltip ||
        `You don't have permission to perform this action`

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                ref={ref}
                disabled
                {...props}
              >
                {children}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <Button
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

ProtectedButton.displayName = 'ProtectedButton'
