'use client'

import { useMemo } from 'react'
import { Checkbox, Label } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

interface PermissionGridProps {
  permissions: Array<{
    id: number
    name: string
    category: string
    description?: string
  }>
  selectedPermissionIds: number[]
  onPermissionChange: (permissionId: number, checked: boolean) => void
  disabled?: boolean
}

export const EmployeePermissionGrid = ({
  permissions,
  selectedPermissionIds,
  onPermissionChange,
  disabled = false,
}: PermissionGridProps) => {
  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    const groups: Record<
      string,
      Array<{
        id: number
        name: string
        category: string
        description?: string
      }>
    > = {}

    permissions.forEach((perm) => {
      const category = perm.category
      if (!groups[category]) {
        groups[category] = []
      }
      const categoryGroup = groups[category]
      if (categoryGroup) {
        categoryGroup.push(perm)
      }
    })

    return groups
  }, [permissions])

  const categories = Object.keys(groupedPermissions).sort()

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryPermissions = groupedPermissions[category]
        if (!categoryPermissions) return null

        return (
        <div key={category} className="rounded-lg border p-4">
          <h3 className="mb-4 text-sm font-semibold capitalize">
            {category}
          </h3>
          <div className="space-y-3">
            {categoryPermissions.map((permission) => (
              <div key={permission.id} className="flex items-start gap-3">
                <Checkbox
                  id={`perm-${permission.id}`}
                  checked={selectedPermissionIds.includes(permission.id)}
                  onCheckedChange={(checked) =>
                    onPermissionChange(permission.id, checked as boolean)
                  }
                  disabled={disabled}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`perm-${permission.id}`}
                    className={cn(
                      'cursor-pointer text-sm font-medium',
                      disabled && 'opacity-50'
                    )}
                  >
                    {permission.name}
                  </label>
                  {permission.description && (
                    <p className="text-muted-foreground text-xs">
                      {permission.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        )
      })}

      {categories.length === 0 && (
        <div className="text-muted-foreground text-center text-sm py-8">
          Нет доступных разрешений
        </div>
      )}
    </div>
  )
}
