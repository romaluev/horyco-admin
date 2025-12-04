'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
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
  BaseLoading,
  Alert,
  AlertDescription,
} from '@/shared/ui'

interface PermissionCopyDialogProps {
  isOpen: boolean
  onClose: () => void
  employeeId: number
  sourceBranchId: number
  branches: Array<{ id: number; name: string }>
  sourcePermissionIds: number[]
  onCopySuccess: (toBranchId: number, permissionIds: number[]) => void
}

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
      // Here we would call the API to copy permissions
      // For now, we'll just update the UI
      onCopySuccess(targetBranchId, sourcePermissionIds)
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
            <label className="text-sm font-medium">
              Куда скопировать
            </label>
            <Select
              value={targetBranchId?.toString()}
              onValueChange={(value) => setTargetBranchId(Number(value))}
            >
              <SelectTrigger>
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
            {isLoading && <BaseLoading />}
            {isLoading ? 'Копирование...' : 'Копировать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
