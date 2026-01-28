import { BaseError, BaseLoading, Checkbox, Label } from '@/shared/ui'

import { useGetAllRoles } from '@/entities/auth/role'

import type { CreateEmployeeFormData } from '../model/contract'
import type { UseFormReturn } from 'react-hook-form'

interface EmployeeFormRolesProps {
  form: UseFormReturn<CreateEmployeeFormData>
}

export const EmployeeFormRoles = ({ form }: EmployeeFormRolesProps) => {
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

  if (isError || roles.length === 0) {
    return <BaseError message="Ошибка при загрузке ролей" />
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          Выберите роли <span className="text-destructive">*</span>
        </Label>
        <p className="text-muted-foreground text-sm">
          Сотрудник может иметь несколько ролей одновременно
        </p>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex items-start gap-4 rounded-lg border p-4"
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
              {role.description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {role.description}
                </p>
              )}
              {role.permissions && role.permissions.length > 0 && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {role.permissions.length} разрешений
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
