'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { BaseError, BaseLoading, Button, Alert, AlertDescription } from '@/shared/ui'
import { useGetAllRoles } from '@/entities/role'
import { employeeApi } from '@/entities/employee'
import { BranchPermissionManager } from './branch-permission-manager'

interface EmployeePermissionsEditorProps {
  employeeId: number
  branches: Array<{ id: number; name: string }>
  onSave?: () => void
}

export const EmployeePermissionsEditor = ({
  employeeId,
  branches,
  onSave,
}: EmployeePermissionsEditorProps) => {
  const { data: rolesResponse, isLoading: rolesLoading } = useGetAllRoles()

  const [permissionsLoading, setPermissionsLoading] = useState(true)
  const [currentPermissions, setCurrentPermissions] = useState<Record<number, number[]>>({})
  const [originalPermissions, setOriginalPermissions] = useState<Record<number, number[]>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Handle both array and paginated response
  const roles = Array.isArray(rolesResponse)
    ? rolesResponse
    : rolesResponse?.data || []

  // Get all available permissions
  const availablePermissions = roles.flatMap((role) => role.permissions || [])
  const uniquePermissions = Array.from(
    new Map(availablePermissions.map((p) => [p.id, p])).values()
  )

  // Load current permissions for each branch
  useEffect(() => {
    const loadPermissions = async () => {
      setPermissionsLoading(true)
      setError(null)
      try {
        const permissions: Record<number, number[]> = {}
        for (const branch of branches) {
          try {
            const branchPerms = await employeeApi.getEmployeeBranchPermissions(
              employeeId,
              branch.id
            )
            permissions[branch.id] = branchPerms.permissions.map(
              (p) => p.permissionId
            )
          } catch (err) {
            // If branch has no permissions yet, just set empty array
            permissions[branch.id] = []
          }
        }
        setCurrentPermissions(permissions)
        setOriginalPermissions(JSON.parse(JSON.stringify(permissions)))
      } catch (err) {
        setError('Ошибка при загрузке разрешений')
        console.error(err)
      } finally {
        setPermissionsLoading(false)
      }
    }

    loadPermissions()
  }, [employeeId, branches])

  const handlePermissionsChange = (branchId: number, permissionIds: number[]) => {
    setCurrentPermissions((prev) => ({
      ...prev,
      [branchId]: permissionIds,
    }))
    setHasChanges(true)
    setSuccessMessage(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      for (const branch of branches) {
        const branchId = branch.id
        const permissionIds = currentPermissions[branchId] || []

        // Update permissions for this branch
        await employeeApi.updatePermissions(employeeId, branchId, {
          permissionIds,
        })
      }

      setHasChanges(false)
      setSuccessMessage('Разрешения успешно сохранены')
      onSave?.()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError('Ошибка при сохранении разрешений')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  if (rolesLoading || permissionsLoading) {
    return <BaseLoading />
  }

  if (branches.length === 0) {
    return (
      <BaseError message="Сотрудник не назначен ни одному филиалу" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {successMessage && (
        <Alert className="border-green-500 bg-green-50">
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Permission Manager */}
      {uniquePermissions.length > 0 ? (
        <BranchPermissionManager
          employeeId={employeeId}
          branches={branches}
          availablePermissions={uniquePermissions}
          currentPermissions={currentPermissions}
          onPermissionsChange={handlePermissionsChange}
          isLoading={permissionsLoading}
          disabled={isSaving}
        />
      ) : (
        <BaseError message="Нет доступных разрешений" />
      )}

      {/* Info Box */}
      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          Вы можете настроить разрешения для каждого филиала отдельно.
          Разрешения, выданные через роли при создании сотрудника,
          могут быть изменены здесь в любое время.
        </p>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Reset to original values
              setCurrentPermissions(JSON.parse(JSON.stringify(originalPermissions)))
              setHasChanges(false)
              setError(null)
            }}
            disabled={isSaving}
          >
            Отменить
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Сохранение...' : 'Сохранить разрешения'}
          </Button>
        </div>
      )}
    </div>
  )
}
