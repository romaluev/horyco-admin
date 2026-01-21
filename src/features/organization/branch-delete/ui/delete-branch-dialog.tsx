'use client'

import { useTranslation } from 'react-i18next'

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
} from '@/entities/organization/branch'

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
  const { t } = useTranslation('organization')
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
            {canDelete ? t('branches.delete.title') : t('branches.delete.cannotDelete')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ? (
              <>
                {t('branches.delete.confirmMessage', { name: branch.name })}
                <br />
                <span className="text-destructive">
                  {t('branches.delete.irreversible')}
                </span>
              </>
            ) : (
              t('branches.delete.reasonsMessage')
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
          <AlertDialogCancel disabled={isPending}>{t('common.cancel')}</AlertDialogCancel>
          {canDelete && (
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending || isCheckingDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending ? t('branches.delete.deleting') : t('branches.delete.delete')}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
