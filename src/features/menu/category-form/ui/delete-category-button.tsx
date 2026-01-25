/**
 * Delete Category Button Component
 * Button with confirmation dialog for deleting categories
 */

'use client'

import { useState } from 'react'

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

import { useDeleteCategory, type ICategory } from '@/entities/menu/category'

interface DeleteCategoryButtonProps {
  category: ICategory
}

export const DeleteCategoryButton = ({
  category,
}: DeleteCategoryButtonProps) => {
  const { t } = useTranslation('menu')
  const [open, setOpen] = useState(false)
  const { mutate: deleteCategory, isPending } = useDeleteCategory()

  const handleDelete = (): void => {
    deleteCategory(category.id, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  const hasChildren = category.children && category.children.length > 0
  const hasProducts = (category.productCount ?? 0) > 0

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('categories.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              {t('categories.delete.confirmMessage', { name: category.name })}
            </p>
            {hasChildren && (
              <p className="text-destructive">
                {t('categories.delete.warningChildren')}
              </p>
            )}
            {hasProducts && (
              <p className="text-destructive">
                {t('categories.delete.warningProducts', { count: category.productCount })}
              </p>
            )}
            {!hasChildren && !hasProducts && (
              <p>{t('categories.delete.irreversible')}</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending || hasChildren || hasProducts}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? t('common.loading') : t('categories.actions.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
