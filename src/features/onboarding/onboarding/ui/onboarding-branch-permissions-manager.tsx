'use client'

import { useState, useEffect } from 'react'

import { Loader2 } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useGetAllPermissions } from '@/entities/auth/role'

import { PermissionsSelectorModal } from './permissions-selector-modal'

import type { IBranch } from '@/entities/organization/branch'
import type { IPermission } from '@/entities/organization/employee'

interface OnboardingBranchPermissionsManagerProps {
  branches: IBranch[]
  onBranchPermissionsChange: (
    branchPermissions: Record<string, { permissionIds: number[] }>
  ) => void
  disabled?: boolean
}

/**
 * Simplified branch permissions manager for onboarding
 * Allows selecting branches and assigning permissions to each branch
 * Does not support permission copy - simpler UI for onboarding
 */

export const OnboardingBranchPermissionsManager = ({
  branches,
  onBranchPermissionsChange,
  disabled = false,
}: OnboardingBranchPermissionsManagerProps) => {
  const { data: allPermissions, isLoading: isLoadingPermissions } =
    useGetAllPermissions()
  const [selectedBranchId, setSelectedBranchId] = useState<string>('')
  const [selectedBranches, setSelectedBranches] = useState<
    Record<number, { permissionIds: number[] }>
  >({})
  const [isPermissionsModalOpen, setPermissionsModalOpen] = useState(false)

  // Notify parent of changes
  useEffect(() => {
    const branchPermissionsMap = Object.entries(selectedBranches).reduce(
      (acc, [branchId, permissions]) => {
        acc[branchId] = permissions
        return acc
      },
      {} as Record<string, { permissionIds: number[] }>
    )
    onBranchPermissionsChange(branchPermissionsMap)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranches])

  const handleBranchSelect = (branchId: string) => {
    const numId = parseInt(branchId, 10)
    if (!selectedBranches[numId]) {
      setSelectedBranches((prev) => ({
        ...prev,
        [numId]: { permissionIds: [] },
      }))
    }
    setSelectedBranchId(branchId)
  }

  const handleRemoveBranch = (branchId: number) => {
    setSelectedBranches((prev) => {
      const updated = { ...prev }
      delete updated[branchId]
      return updated
    })
    if (parseInt(selectedBranchId, 10) === branchId) {
      setSelectedBranchId('')
    }
  }

  const handlePermissionsSave = (permissionIds: number[]) => {
    const numId = parseInt(selectedBranchId, 10)
    setSelectedBranches((prev) => ({
      ...prev,
      [numId]: { permissionIds },
    }))
    setPermissionsModalOpen(false)
  }

  const currentBranchId = parseInt(selectedBranchId, 10)
  const currentPermissions =
    selectedBranches[currentBranchId]?.permissionIds || []
  const selectedBranchData = branches.find((b) => b.id === currentBranchId)

  return (
    <div className="space-y-4">
      {/* Branch Selection */}
      <div>
        <label htmlFor="branch-select" className="text-sm font-medium">
          Выберите филиал
        </label>
        <Select
          value={selectedBranchId}
          onValueChange={handleBranchSelect}
          disabled={disabled || isLoadingPermissions}
        >
          <SelectTrigger id="branch-select">
            <SelectValue placeholder="Выберите филиал для добавления доступа" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => {
              const isSelected = !!selectedBranches[branch.id]
              return (
                <SelectItem
                  key={branch.id}
                  value={branch.id.toString()}
                  disabled={isSelected}
                >
                  {branch.name} {isSelected ? '✓' : ''}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Branches */}
      {Object.keys(selectedBranches).length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Добавленные филиалы</div>
          <div className="space-y-2">
            {Object.entries(selectedBranches).map(([branchId, perms]) => {
              const branch = branches.find(
                (b) => b.id === parseInt(branchId, 10)
              )
              const numId = parseInt(branchId, 10)
              return (
                <div
                  key={branchId}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{branch?.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {perms.permissionIds.length > 0
                        ? `${perms.permissionIds.length} прав`
                        : 'Нет выбранных прав'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBranchId(branchId)
                        setPermissionsModalOpen(true)
                      }}
                      disabled={disabled || isLoadingPermissions}
                    >
                      Редактировать права
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBranch(numId)}
                      disabled={disabled}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {selectedBranchData && (
        <PermissionsSelectorModal
          isOpen={isPermissionsModalOpen}
          onOpenChange={setPermissionsModalOpen}
          branchName={selectedBranchData.name}
          allPermissions={(allPermissions as IPermission[]) || []}
          currentPermissionIds={currentPermissions}
          isLoading={isLoadingPermissions}
          onPermissionsSave={handlePermissionsSave}
        />
      )}

      {isLoadingPermissions && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  )
}
