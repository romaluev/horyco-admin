'use client'

import { useCallback, useEffect, useState } from 'react'

import { Copy, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  Alert,
  AlertDescription,
  BaseLoading,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Switch,
} from '@/shared/ui'

import { employeeApi } from '@/entities/organization/employee'
import { PermissionCopyDialog } from '@/features/organization/employee-permissions/ui/permission-copy-dialog'

import type { IPermission } from '@/entities/organization/employee'

interface PermissionsEditorModalProps {
  isOpen: boolean
  onClose: () => void
  employeeId: number
  branchId: number
  branchName: string
  availablePermissions: IPermission[]
  currentPermissionIds?: number[]
  onPermissionsChange?: (branchId: number, permissionIds: number[]) => void
  onSave?: () => void
}

export const PermissionsEditorModal = ({
  isOpen,
  onClose,
  employeeId,
  branchId,
  branchName,
  availablePermissions,
  currentPermissionIds,
  onPermissionsChange,
  onSave,
}: PermissionsEditorModalProps) => {
  const { t } = useTranslation('organization')
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isShowingCopyDialog, setIsShowingCopyDialog] = useState(false)

  const loadPermissions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const perms = await employeeApi.getEmployeeBranchPermissions(
        employeeId,
        branchId
      )
      // API returns array of permissions directly or wrapped in permissions field
      const permissionsArray = Array.isArray(perms)
        ? perms
        : perms.permissions || []
      setSelectedPermissions(
        permissionsArray.map(
          (p) => (p as { permissionId: number }).permissionId
        )
      )
    } catch (err) {
      // Branch might not exist yet - start with empty permissions
      setSelectedPermissions([])
    } finally {
      setIsLoading(false)
    }
  }, [employeeId, branchId])

  // Load current permissions when modal opens
  useEffect(() => {
    if (isOpen) {
      // If currentPermissionIds are provided, use them directly
      if (currentPermissionIds !== undefined) {
        setSelectedPermissions(currentPermissionIds)
        setIsLoading(false)
      } else if (employeeId > 0) {
        // Otherwise, try to load from API
        loadPermissions()
      } else {
        // Create mode - start with no permissions
        setSelectedPermissions([])
        setIsLoading(false)
      }
    }
  }, [isOpen, branchId, employeeId, currentPermissionIds, loadPermissions])

  const handlePermissionToggle = (permissionId: number, enabled: boolean) => {
    setSelectedPermissions((prev) =>
      enabled
        ? [...prev, permissionId]
        : prev.filter((id) => id !== permissionId)
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      // Update permissions only if employee already exists (employeeId > 0)
      if (employeeId > 0) {
        await employeeApi.updatePermissions(employeeId, branchId, {
          permissionIds: selectedPermissions,
        })
      }

      // Notify parent component of permission changes
      onPermissionsChange?.(branchId, selectedPermissions)

      toast.success(t('permissions.saveSuccess'))
      onSave?.()
      onClose()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('permissions.saveError')
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  // Group permissions by category
  const groupedPermissions = availablePermissions.reduce<
    Record<string, IPermission[]>
  >((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = []
    }

    acc[perm.category]!.push(perm)
    return acc
  }, {})

  const categories = Object.keys(groupedPermissions).sort()

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('permissions.title')}</DialogTitle>
            <DialogDescription>
              {t('permissions.description', { branchName })}
            </DialogDescription>
          </DialogHeader>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <BaseLoading />
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {/* Copy Permissions Button - only for update, not create */}
              {employeeId > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsShowingCopyDialog(true)}
                  disabled={isSaving}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {t('permissions.copyFromBranch')}
                </Button>
              )}

              {/* Permissions Grid */}
              <div className="space-y-6">
                {categories.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    {t('permissions.noAvailable')}
                  </p>
                ) : (
                  categories.map((category) => (
                    <div key={category} className="rounded-lg border p-4">
                      <h3 className="mb-4 text-sm font-semibold capitalize">
                        {category}
                      </h3>
                      <div className="space-y-3">
                        {(groupedPermissions[category] ?? []).map(
                          (permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center gap-3"
                            >
                              <Switch
                                id={`perm-${permission.id}`}
                                checked={selectedPermissions.includes(
                                  permission.id
                                )}
                                onCheckedChange={(checked: boolean) =>
                                  handlePermissionToggle(permission.id, checked)
                                }
                                disabled={isSaving}
                              />
                              <label
                                htmlFor={`perm-${permission.id}`}
                                className="flex-1 cursor-pointer text-sm font-medium"
                              >
                                {permission.name}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Info Box */}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground text-sm">
                  {t('permissions.info')}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLoading}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? t('common.actions.saving') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy Dialog */}
      {isShowingCopyDialog && (
        <PermissionCopyDialog
          isOpen={isShowingCopyDialog}
          onClose={() => setIsShowingCopyDialog(false)}
          employeeId={employeeId}
          sourceBranchId={branchId}
          branches={[]} // Will be filled by the dialog component
          sourcePermissionIds={selectedPermissions}
          onCopySuccess={(_, permissionIds) => {
            setSelectedPermissions(permissionIds)
            setIsShowingCopyDialog(false)
          }}
        />
      )}
    </>
  )
}
