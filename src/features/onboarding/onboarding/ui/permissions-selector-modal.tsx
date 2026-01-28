'use client'

import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'
import { Checkbox } from '@/shared/ui/base/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Label } from '@/shared/ui/base/label'
import { ScrollArea } from '@/shared/ui/base/scroll-area'

import type { IPermission } from '@/entities/organization/employee'

interface PermissionsSelectorModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  branchName: string
  allPermissions: IPermission[]
  currentPermissionIds: number[]
  isLoading?: boolean
  onPermissionsSave: (permissionIds: number[]) => void
}

/**
 * Simplified permissions selector modal for onboarding
 * Shows permissions grouped by category with checkboxes
 */
// eslint-disable-next-line max-lines-per-function
export const PermissionsSelectorModal = ({
  isOpen,
  onOpenChange,
  branchName,
  allPermissions,
  currentPermissionIds,
  isLoading = false,
  onPermissionsSave,
}: PermissionsSelectorModalProps) => {
  const { t } = useTranslation('onboarding')
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(
    new Set(currentPermissionIds)
  )

  // Update selected permissions when current permissions change
  useEffect(() => {
    setSelectedPermissions(new Set(currentPermissionIds))
  }, [currentPermissionIds, isOpen])

  // Group permissions by category
  const groupedPermissions = allPermissions.reduce(
    (acc, perm) => {
      const category = perm.category || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(perm)
      return acc
    },
    {} as Record<string, IPermission[]>
  )

  const handlePermissionToggle = (permissionId: number) => {
    const newSelected = new Set(selectedPermissions)
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId)
    } else {
      newSelected.add(permissionId)
    }
    setSelectedPermissions(newSelected)
  }

  const handleSave = () => {
    onPermissionsSave(Array.from(selectedPermissions))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('pages.staffInvite.permissionsModal.title')} - {branchName}</DialogTitle>
          <DialogDescription>
            {t('pages.staffInvite.permissionsModal.description')}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <div key={category}>
                  <h3 className="mb-3 text-sm font-semibold uppercase">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {perms.map((perm) => (
                      <div
                        key={perm.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`perm-${perm.id}`}
                          checked={selectedPermissions.has(perm.id)}
                          onCheckedChange={() =>
                            handlePermissionToggle(perm.id)
                          }
                          disabled={isLoading}
                        />
                        <Label
                          htmlFor={`perm-${perm.id}`}
                          className="flex-1 cursor-pointer text-sm font-normal"
                        >
                          {perm.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t('pages.staffInvite.permissionsModal.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('pages.staffInvite.permissionsModal.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
