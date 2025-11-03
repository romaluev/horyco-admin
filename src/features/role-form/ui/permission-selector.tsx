import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  BaseError,
  BaseLoading,
  Checkbox,
  Label,
} from '@/shared/ui'

import { useGetPermissionsGrouped } from '@/entities/role'

import type { CreateRoleFormData } from '../model/contract'
import type { UseFormReturn } from 'react-hook-form'

interface PermissionSelectorProps {
  form: UseFormReturn<CreateRoleFormData>
}

export const PermissionSelector = ({ form }: PermissionSelectorProps) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form
  const {
    data: permissionsGrouped,
    isLoading,
    isError,
  } = useGetPermissionsGrouped()

  const selectedPermissionIds = watch('permissionIds') || []

  const togglePermission = (permissionId: number): void => {
    const currentPermissionIds = selectedPermissionIds
    if (currentPermissionIds.includes(permissionId)) {
      setValue(
        'permissionIds',
        currentPermissionIds.filter((id) => id !== permissionId)
      )
    } else {
      setValue('permissionIds', [...currentPermissionIds, permissionId])
    }
  }

  const toggleAll = (permissions: { id: number }[]): void => {
    const permissionIds = permissions.map((p) => p.id)
    const allSelected = permissionIds.every((id) =>
      selectedPermissionIds.includes(id)
    )

    if (allSelected) {
      setValue(
        'permissionIds',
        selectedPermissionIds.filter((id) => !permissionIds.includes(id))
      )
    } else {
      const newIds = [...new Set([...selectedPermissionIds, ...permissionIds])]
      setValue('permissionIds', newIds)
    }
  }

  const isAllSelected = (permissions: { id: number }[]): boolean => {
    return permissions.every((p) => selectedPermissionIds.includes(p.id))
  }

  const selectedCount = (permissions: { id: number }[]): number => {
    return permissions.filter((p) => selectedPermissionIds.includes(p.id))
      .length
  }

  if (isLoading) {
    return <BaseLoading />
  }

  if (isError || !permissionsGrouped) {
    return <BaseError message="Ошибка при загрузке разрешений" />
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">
          Разрешения <span className="text-destructive">*</span>
        </Label>
        <p className="text-muted-foreground text-sm">
          Выберите разрешения для этой роли
        </p>
      </div>

      <Accordion type="multiple" className="w-full">
        {Object.entries(permissionsGrouped).map(([category, permissions]) => (
          <AccordionItem key={category} value={category}>
            <div className="flex items-center gap-2 py-4">
              <Checkbox
                checked={isAllSelected(permissions)}
                onCheckedChange={() => toggleAll(permissions)}
              />
              <AccordionTrigger className="flex-1 py-0 hover:no-underline">
                <div className="flex w-full items-center justify-between">
                  <span className="text-left font-medium">{category}</span>
                  <Badge variant="outline" className="mr-2">
                    {selectedCount(permissions)} / {permissions.length}
                  </Badge>
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent>
              <div className="space-y-4 pl-6">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={selectedPermissionIds.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <label
                      htmlFor={`permission-${permission.id}`}
                      className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {errors.permissionIds && (
        <p className="text-destructive text-sm">
          {errors.permissionIds.message}
        </p>
      )}
    </div>
  )
}
