'use client'

import { useMemo } from 'react'

import { BaseError, BaseLoading, Label } from '@/shared/ui'

import { useGetAllRoles } from '@/entities/auth/role'
import { EmployeePermissionGrid } from '@/features/organization/employee-permissions/ui/employee-permission-grid'

import type { CreateEmployeeFormData } from '../model/contract'
import type { UseFormReturn } from 'react-hook-form'

interface EmployeeFormPermissionsProps {
  form: UseFormReturn<CreateEmployeeFormData>
}

export const EmployeeFormPermissions = ({
  form,
}: EmployeeFormPermissionsProps) => {
  const { watch, setValue } = form
  const { data: rolesResponse, isLoading, isError } = useGetAllRoles()

  const selectedRoleIds = watch('roleIds') || []
  const selectedBranchIds = watch('branchIds') || []

  // Handle both array and paginated response
  const roles = Array.isArray(rolesResponse)
    ? rolesResponse
    : rolesResponse?.data || []

  // Get all unique permissions from selected roles
  const rolePermissions = useMemo(() => {
    const permissionMap = new Map<
      number,
      { id: number; name: string; category: string; description?: string }
    >()

    selectedRoleIds.forEach((roleId) => {
      const role = roles.find((r) => r.id === roleId)
      if (role?.permissions) {
        role.permissions.forEach((perm) => {
          permissionMap.set(perm.id, perm)
        })
      }
    })

    return Array.from(permissionMap.values())
  }, [selectedRoleIds, roles])

  if (isLoading) {
    return <BaseLoading />
  }

  if (isError) {
    return <BaseError message="Ошибка при загрузке разрешений" />
  }

  if (selectedBranchIds.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">
          Сначала выберите филиалы на предыдущем шаге
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          Разрешения на основе выбранных ролей
        </Label>
        <p className="text-muted-foreground text-sm mt-1">
          Разрешения будут назначены для всех выбранных филиалов на основе
          выбранных ролей. Вы сможете настроить их позже.
        </p>
      </div>

      {rolePermissions.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">
            Выбранные роли не содержат разрешений
          </p>
        </div>
      ) : (
        <EmployeePermissionGrid
          permissions={rolePermissions}
          selectedPermissionIds={[]}
          onPermissionChange={() => {}}
          disabled
        />
      )}

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm font-medium mb-2">Информация</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Разрешения будут применены ко всем выбранным филиалам</li>
          <li>• Вы сможете изменить разрешения отдельно для каждого филиала позже</li>
          <li>• Изменение ролей после создания не повлияет на уже выданные разрешения</li>
        </ul>
      </div>
    </div>
  )
}
