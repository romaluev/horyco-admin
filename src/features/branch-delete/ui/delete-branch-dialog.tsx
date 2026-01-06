'use client'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/base/alert-dialog'

import {
  useCanDeleteBranch,
  useDeleteBranch,
  type IBranch,
} from '@/entities/branch'

interface DeleteBranchDialogProps {
  isOpen: boolean
  onClose: () => void
  branch: IBranch
  onSuccess?: () => void
}

export const DeleteBranchDialog = ({
  isOpen,
  onClose,
  branch,
  onSuccess,
}: DeleteBranchDialogProps) => {
  const { data: canDeleteData, isLoading: isCheckingDelete } =
    useCanDeleteBranch(branch.id, isOpen)
  const { mutate: deleteBranch, isPending } = useDeleteBranch()

  const canDelete = canDeleteData?.canDelete ?? false
  const blockingReasons = canDeleteData?.blockingReasons

  const handleDelete = () => {
    if (!canDelete) return

    deleteBranch(branch.id, {
      onSuccess: () => {
        onClose()
        onSuccess?.()
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {canDelete ? 'Удалить филиал?' : 'Невозможно удалить филиал'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ? (
              <>
                Вы уверены, что хотите удалить филиал{' '}
                <strong>{branch.name}</strong>?
                <br />
                <span className="text-destructive">
                  Это действие нельзя отменить.
                </span>
              </>
            ) : (
              'Этот филиал невозможно удалить по следующим причинам:'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!canDelete && !isCheckingDelete && blockingReasons && (
          <div className="space-y-2">
            {blockingReasons.halls && (
              <Alert variant="destructive">
                <AlertDescription>{blockingReasons.halls}</AlertDescription>
              </Alert>
            )}
            {blockingReasons.employees && (
              <Alert variant="destructive">
                <AlertDescription>{blockingReasons.employees}</AlertDescription>
              </Alert>
            )}
            {blockingReasons.orders && (
              <Alert variant="destructive">
                <AlertDescription>{blockingReasons.orders}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          {canDelete && (
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending || isCheckingDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
