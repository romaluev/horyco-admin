'use client'

import { useEffect, useState } from 'react'
import { BaseError, BaseLoading, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui'

interface RoleTemplateOption {
  id: number
  name: string
  description?: string
  permissionIds: number[]
}

interface RoleTemplateSelectorProps {
  roles: RoleTemplateOption[]
  onRoleSelect: (permissionIds: number[]) => void
  isLoading?: boolean
  disabled?: boolean
}

export const RoleTemplateSelector = ({
  roles,
  onRoleSelect,
  isLoading = false,
  disabled = false,
}: RoleTemplateSelectorProps) => {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)

  const selectedRole = roles.find((r) => r.id === selectedRoleId)

  useEffect(() => {
    if (selectedRoleId && selectedRole) {
      onRoleSelect(selectedRole.permissionIds)
      setSelectedRoleId(null) // Reset after selection
    }
  }, [selectedRoleId, selectedRole, onRoleSelect])

  if (isLoading) {
    return <BaseLoading />
  }

  if (roles.length === 0) {
    return <BaseError message="Нет доступных ролей" />
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Шаблон роли (опционально)
      </label>
      <p className="text-xs text-muted-foreground">
        Выбор роли автоматически заполнит разрешения. Вы сможете их
        отредактировать после выбора.
      </p>
      <Select
        value={selectedRoleId?.toString()}
        onValueChange={(value) => setSelectedRoleId(Number(value))}
      >
        <SelectTrigger disabled={disabled}>
          <SelectValue placeholder="Выберите шаблон роли..." />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id.toString()}>
              <div>
                <div className="font-medium">{role.name}</div>
                {role.description && (
                  <div className="text-xs text-muted-foreground">
                    {role.description}
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
