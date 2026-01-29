'use client'

import { useState } from 'react'

import { Edit2 } from 'lucide-react'

import {
  BaseError,
  BaseLoading,
  Button,
  Label,
  Switch,
} from '@/shared/ui'

import { useGetAllRoles } from '@/entities/auth/role'
import { useGetAllBranches } from '@/entities/organization/branch'

import { PermissionsEditorModal } from './permissions-editor-modal'

import type { IPermission } from '@/entities/organization/employee'

interface CreateBranchPermissionsManagerProps {
  selectedBranchIds: number[]
  onBranchesChange: (branchIds: number[]) => void
   
  onPermissionsChange?: (branchId: number, permissionIds: number[]) => void
  branchPermissions: Record<number, number[]> // branchId -> permissionIds
}

// eslint-disable-next-line max-lines-per-function
export const CreateBranchPermissionsManager = ({
  selectedBranchIds,
  onBranchesChange,
   
  onPermissionsChange,
  branchPermissions,
}: CreateBranchPermissionsManagerProps) => {
  const { data: branchesData, isLoading: isBranchesLoading } =
    useGetAllBranches()
  const { data: rolesData } = useGetAllRoles()

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [isEditingPermissions, setIsEditingPermissions] = useState(false)

  const branches = branchesData?.items || []
  const roles = Array.isArray(rolesData) ? rolesData : rolesData?.data || []

  // Get all available permissions from roles
  const availablePermissions: IPermission[] = Array.from(
    new Map(
      roles.flatMap((role) => role.permissions || []).map((p) => [p.id, p])
    ).values()
  )

  const handleToggleBranch = (branchId: number, isEnabled: boolean) => {
    if (isEnabled) {
      // Enable branch - add it to the list and open permissions editor
      if (!selectedBranchIds.includes(branchId)) {
        onBranchesChange([...selectedBranchIds, branchId])
      }
      setSelectedBranchId(branchId)
      setIsEditingPermissions(true)
    } else {
      // Disable branch
      const newBranchIds = selectedBranchIds.filter((id) => id !== branchId)
      onBranchesChange(newBranchIds)
      // Also remove permissions for this branch
      const newPerms = { ...branchPermissions }
      delete newPerms[branchId]
    }
  }

  const handleEditPermissions = (branchId: number) => {
    setSelectedBranchId(branchId)
    setIsEditingPermissions(true)
  }

  const handlePermissionsSave = () => {
    setIsEditingPermissions(false)
    setSelectedBranchId(null)
  }

  if (isBranchesLoading) {
    return <BaseLoading />
  }

  if (!branches || branches.length === 0) {
    return <BaseError message="Нет доступных филиалов" />
  }

  const selectedBranch = branches.find((b) => b.id === selectedBranchId)

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          Филиалы и разрешения <span className="text-destructive">*</span>
        </Label>
        <p className="text-muted-foreground text-sm mt-2">
          Выберите филиалы, в которых будет работать сотрудник. При включении филиала откроется окно для выбора разрешений.
        </p>
      </div>

      {/* List of branches */}
      <div className="space-y-3">
        {branches.map((branch) => {
          const isAssigned = selectedBranchIds.includes(branch.id)
          const hasPermissions = (branchPermissions[branch.id] || []).length > 0

          return (
            <div
              key={branch.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <Switch
                  id={`branch-${branch.id}`}
                  checked={isAssigned}
                  onCheckedChange={(checked: boolean) =>
                    handleToggleBranch(branch.id, checked)
                  }
                />
                <div className="flex-1">
                  <label
                    htmlFor={`branch-${branch.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {branch.name}
                  </label>
                  {branch.address && (
                    <p className="text-muted-foreground text-sm">
                      {branch.address}
                    </p>
                  )}
                  {isAssigned && hasPermissions && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Разрешений: {(branchPermissions[branch.id] || []).length}
                    </p>
                  )}
                </div>
              </div>

              {/* Edit button - only show if branch is assigned */}
              {isAssigned && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditPermissions(branch.id)}
                >
                  <Edit2 className="h-4 w-4" />
                  Разрешения
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Info Box */}
      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          Выбранные филиалы: {selectedBranchIds.length > 0 ? selectedBranchIds.length : 'не выбраны'}
        </p>
      </div>

      {/* Permissions Editor Modal */}
      {selectedBranch && isEditingPermissions && (
        <PermissionsEditorModal
          isOpen={isEditingPermissions}
          onClose={() => {
            setIsEditingPermissions(false)
            setSelectedBranchId(null)
          }}
          employeeId={0} // Not used in create flow, will be generated by API
          branchId={selectedBranch.id}
          branchName={selectedBranch.name}
          availablePermissions={availablePermissions}
          currentPermissionIds={branchPermissions[selectedBranch.id]}
          onPermissionsChange={onPermissionsChange}
          onSave={handlePermissionsSave}
        />
      )}
    </div>
  )
}
