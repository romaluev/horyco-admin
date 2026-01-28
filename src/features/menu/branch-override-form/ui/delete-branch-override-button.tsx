/**
 * Delete Branch Override Button
 * Button for deleting branch overrides
 */

'use client'

import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/base/alert-dialog'
import { Button } from '@/shared/ui/base/button'

import { useDeleteBranchOverride } from '@/entities/menu/branch-override'

interface DeleteBranchOverrideButtonProps {
  productId: number
  branchId: number
  productName?: string
  branchName?: string
}

export const DeleteBranchOverrideButton = ({
  productId,
  branchId,
  productName,
  branchName,
}: DeleteBranchOverrideButtonProps) => {
  const { t } = useTranslation('menu')
  const { mutate: deleteOverride, isPending } = useDeleteBranchOverride()

  const handleDelete = (): void => {
    deleteOverride({ productId, branchId })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Trash2 className="text-destructive h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('branchOverrides.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {productName && branchName ? (
              t('branchOverrides.delete.withNames', { productName, branchName })
            ) : (
              t('branchOverrides.delete.withoutNames')
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? t('common.loading') : t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
