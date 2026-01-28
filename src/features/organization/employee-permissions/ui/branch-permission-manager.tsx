'use client'

import { useState } from 'react'

import { BaseError, BaseLoading, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui'

import { EmployeePermissionGrid } from './employee-permission-grid'
import { PermissionCopyDialog } from './permission-copy-dialog'

interface BranchPermissionManagerProps {
  employeeId: number
  branches: { id: number; name: string }[]
  availablePermissions: {
    id: number
    name: string
    category: string
    description?: string
  }[]
  currentPermissions: Record<number, number[]> // branchId -> permissionIds
  onPermissionsChange: (branchId: number, permissionIds: number[]) => void
  isLoading?: boolean
  disabled?: boolean
}

export const BranchPermissionManager = ({
  employeeId,
  branches,
  availablePermissions,
  currentPermissions,
  onPermissionsChange,
  isLoading = false,
  disabled = false,
}: BranchPermissionManagerProps) => {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(
    branches[0]?.id || null
  )
  const [showCopyDialog, setShowCopyDialog] = useState(false)

  if (!selectedBranchId) {
    return (
      <BaseError message="Нет доступных филиалов для выбора" />
    )
  }

  const selectedPermissionIds = currentPermissions[selectedBranchId] || []

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    const newPermissions = checked
      ? [...selectedPermissionIds, permissionId]
      : selectedPermissionIds.filter((id) => id !== permissionId)
    onPermissionsChange(selectedBranchId, newPermissions)
  }

  return (
    <div className="space-y-6">
      {/* Branch Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Филиал</label>
        <Select
          value={selectedBranchId?.toString()}
          onValueChange={(value) => setSelectedBranchId(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите филиал" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id.toString()}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Copy Permissions Button */}
      {branches.length > 1 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCopyDialog(true)}
          disabled={disabled || isLoading}
        >
          Копировать разрешения
        </Button>
      )}

      {/* Permissions Grid */}
      {isLoading ? (
        <BaseLoading />
      ) : (
        <EmployeePermissionGrid
          permissions={availablePermissions}
          selectedPermissionIds={selectedPermissionIds}
          onPermissionChange={handlePermissionChange}
          disabled={disabled}
        />
      )}

      {/* Copy Dialog */}
      {showCopyDialog && selectedBranchId && (
        <PermissionCopyDialog
          isOpen={showCopyDialog}
          onClose={() => setShowCopyDialog(false)}
          employeeId={employeeId}
          sourceBranchId={selectedBranchId}
          branches={branches}
          sourcePermissionIds={selectedPermissionIds}
          onCopySuccess={(toBranchId, permissionIds) => {
            onPermissionsChange(toBranchId, permissionIds)
            setShowCopyDialog(false)
          }}
        />
      )}
    </div>
  )
}
