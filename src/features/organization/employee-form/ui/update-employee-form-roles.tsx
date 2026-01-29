'use client'

import { Checkbox, Label, BaseError, BaseLoading } from '@/shared/ui'

import { useGetAllRoles } from '@/entities/auth/role'

import type { UpdateEmployeeFormData } from '../model/contract'
import type { UseFormReturn } from 'react-hook-form'

interface UpdateEmployeeFormRolesProps {
  form: UseFormReturn<UpdateEmployeeFormData>
}

export const UpdateEmployeeFormRoles = ({
  form,
}: UpdateEmployeeFormRolesProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form
  const { data: rolesResponse, isLoading, isError } = useGetAllRoles()

  const selectedRoleIds = watch('roleIds') || []

  // Handle both array and paginated response
  const roles = Array.isArray(rolesResponse)
    ? rolesResponse
    : rolesResponse?.data || []

  const toggleRole = (roleId: number): void => {
    const currentRoleIds = selectedRoleIds
    if (currentRoleIds.includes(roleId)) {
      setValue(
        'roleIds',
        currentRoleIds.filter((id) => id !== roleId)
      )
    } else {
      setValue('roleIds', [...currentRoleIds, roleId])
    }
  }

  if (isLoading) {
    return <BaseLoading />
  }

  if (isError || !roles) {
    return <BaseError message="Ошибка при загрузке ролей" />
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          Выберите роли <span className="text-destructive">*</span>
        </Label>
        <p className="text-muted-foreground mt-2 text-sm">
          Роли определяют, какие действия может выполнять сотрудник. Сотруднику
          можно назначить несколько ролей.
        </p>
      </div>

      <div className="space-y-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex items-start gap-3 rounded-lg border p-4"
          >
            <Checkbox
              id={`role-${role.id}`}
              checked={selectedRoleIds.includes(role.id)}
              onCheckedChange={() => toggleRole(role.id)}
            />
            <div className="flex-1">
              <label
                htmlFor={`role-${role.id}`}
                className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {role.name}
              </label>
              {role.permissions && role.permissions.length > 0 && (
                <p className="text-muted-foreground mt-2 text-xs">
                  Разрешения: {role.permissions.map((p) => p.name).join(', ')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {errors.roleIds && (
        <p className="text-destructive text-sm">{errors.roleIds.message}</p>
      )}
    </div>
  )
}
