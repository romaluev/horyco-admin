'use client'

import { useState } from 'react'

import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription,
} from '@/shared/ui'

import { employeeApi } from '@/entities/organization/employee'

interface PermissionCopyDialogProps {
  isOpen: boolean
  onClose: () => void
  employeeId: number
  sourceBranchId: number
  branches: { id: number; name: string }[]
  sourcePermissionIds: number[]
  onCopySuccess: (toBranchId: number, permissionIds: number[]) => void
}

// eslint-disable-next-line max-lines-per-function
export const PermissionCopyDialog = ({
  isOpen,
  onClose,
  employeeId,
  sourceBranchId,
  branches,
  sourcePermissionIds,
  onCopySuccess,
}: PermissionCopyDialogProps) => {
  const [targetBranchId, setTargetBranchId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const sourceBranch = branches.find((b) => b.id === sourceBranchId)
  const targetBranch = targetBranchId
    ? branches.find((b) => b.id === targetBranchId)
    : null

  const availableTargetBranches = branches.filter(
    (b) => b.id !== sourceBranchId
  )

  const handleCopy = async () => {
    if (!targetBranchId) return

    setIsLoading(true)
    try {
      await employeeApi.copyPermissions(employeeId, {
        fromBranchId: sourceBranchId,
        toBranchId: targetBranchId,
      })
      toast.success('Разрешения успешно скопированы')
      onCopySuccess(targetBranchId, sourcePermissionIds)
      onClose()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка при копировании'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Копировать разрешения</DialogTitle>
          <DialogDescription>
            Скопировать разрешения с одного филиала на другой
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Source Branch Info */}
          <div className="rounded-lg border bg-muted p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Откуда
            </p>
            <p className="text-sm font-semibold">{sourceBranch?.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {sourcePermissionIds.length} разрешений
            </p>
          </div>

          {/* Target Branch Selector */}
          <div className="space-y-2">
            <label htmlFor="target-branch" className="text-sm font-medium">
              Куда скопировать
            </label>
            <Select
              value={targetBranchId?.toString()}
              onValueChange={(value) => setTargetBranchId(Number(value))}
            >
              <SelectTrigger id="target-branch">
                <SelectValue placeholder="Выберите целевой филиал" />
              </SelectTrigger>
              <SelectContent>
                {availableTargetBranches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warning Alert */}
          {targetBranch && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Это заменит все текущие разрешения в филиале{' '}
                <strong>{targetBranch.name}</strong>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            type="button"
            onClick={handleCopy}
            disabled={!targetBranchId || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Копирование...' : 'Копировать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
