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
import { employeeApi } from '@/entities/organization/employee'
import { PermissionCopyDialog } from '@/features/organization/employee-permissions/ui/permission-copy-dialog'

import { PermissionsEditorModal } from './permissions-editor-modal'

interface UpdateBranchPermissionsManagerProps {
  employeeId: number
  selectedBranchIds: number[]
  onBranchesChange: (branchIds: number[]) => void
}

// eslint-disable-next-line max-lines-per-function, complexity
export const UpdateBranchPermissionsManager = ({
  employeeId,
  selectedBranchIds,
  onBranchesChange,
}: UpdateBranchPermissionsManagerProps) => {
  const { data: branchesData, isLoading: isBranchesLoading } = useGetAllBranches()
  const { data: rolesData } = useGetAllRoles()

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [isEditingPermissions, setIsEditingPermissions] = useState(false)
  const [currentPermissionIds, setCurrentPermissionIds] = useState<number[]>([])
  const [isShowingCopyDialog, setIsShowingCopyDialog] = useState(false)

  const branches = branchesData?.items || []
  const assignedBranchIds = selectedBranchIds

  // Get all available permissions from roles
  const roles = Array.isArray(rolesData) ? rolesData : rolesData?.data || []
  const availablePermissions = Array.from(
    new Map(
      roles.flatMap((role) => role.permissions || []).map((p) => [p.id, p])
    ).values()
  )

  // Load permissions when opening editor
  const loadBranchPermissions = async (branchId: number) => {
    try {
      const perms = await employeeApi.getEmployeeBranchPermissions(
        employeeId,
        branchId
      )
      // API returns array of permissions directly or wrapped in permissions field
      const permissionsArray = Array.isArray(perms)
        ? perms
        : perms.permissions || []
      setCurrentPermissionIds(
        permissionsArray.map((p) => (p as { permissionId: number }).permissionId)
      )
    } catch (err) {
      setCurrentPermissionIds([])
    }
  }

  const handleToggleBranch = (branchId: number, isEnabled: boolean) => {
    if (isEnabled) {
      // Enable branch - add it to the list and open permissions editor
      if (!assignedBranchIds.includes(branchId)) {
        onBranchesChange([...assignedBranchIds, branchId])
      }
      setSelectedBranchId(branchId)
      setIsEditingPermissions(true)
      loadBranchPermissions(branchId)
    } else {
      // Disable branch - remove from assigned
      const newBranchIds = assignedBranchIds.filter((id) => id !== branchId)
      onBranchesChange(newBranchIds)
    }
  }

  const handleEditPermissions = (branchId: number) => {
    setSelectedBranchId(branchId)
    setIsEditingPermissions(true)
    loadBranchPermissions(branchId)
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
          Сотрудник может работать в нескольких филиалах. Разрешения можно настроить для каждого филиала отдельно.
        </p>
      </div>

      {/* List of branches */}
      <div className="space-y-3">
        {branches.map((branch) => {
          const isAssigned = assignedBranchIds.includes(branch.id)

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

      {/* Permissions Editor Modal */}
      {selectedBranch && isEditingPermissions && (
        <PermissionsEditorModal
          isOpen={isEditingPermissions}
          onClose={() => {
            setIsEditingPermissions(false)
            setSelectedBranchId(null)
          }}
          employeeId={employeeId}
          branchId={selectedBranch.id}
          branchName={selectedBranch.name}
          availablePermissions={availablePermissions}
          currentPermissionIds={currentPermissionIds}
          onPermissionsChange={(_, permissionIds) => {
            setCurrentPermissionIds(permissionIds)
          }}
          onSave={handlePermissionsSave}
        />
      )}

      {/* Copy Dialog */}
      {isShowingCopyDialog && selectedBranchId && (
        <PermissionCopyDialog
          isOpen={isShowingCopyDialog}
          onClose={() => setIsShowingCopyDialog(false)}
          employeeId={employeeId}
          sourceBranchId={selectedBranchId}
          branches={branches.filter((b) => assignedBranchIds.includes(b.id))}
          sourcePermissionIds={currentPermissionIds}
          onCopySuccess={() => {
            setIsShowingCopyDialog(false)
            if (selectedBranchId) {
              loadBranchPermissions(selectedBranchId)
            }
          }}
        />
      )}
    </div>
  )
}
