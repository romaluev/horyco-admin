/**
 * Delete Category Button Component
 * Button with confirmation dialog for deleting categories
 */

'use client'

import { useState } from 'react'

import { Trash2 } from 'lucide-react'

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

import { useDeleteCategory, type ICategory } from '@/entities/category'

interface DeleteCategoryButtonProps {
  category: ICategory
}

export const DeleteCategoryButton = ({
  category,
}: DeleteCategoryButtonProps) => {
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
          <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Вы уверены, что хотите удалить категорию{' '}
              <strong>{category.name}</strong>?
            </p>
            {hasChildren && (
              <p className="text-destructive">
                ⚠️ Эта категория содержит подкатегории. Сначала удалите их.
              </p>
            )}
            {hasProducts && (
              <p className="text-destructive">
                ⚠️ Эта категория содержит {category.productCount} продукт(ов).
                Переместите их в другую категорию перед удалением.
              </p>
            )}
            {!hasChildren && !hasProducts && (
              <p>Это действие нельзя отменить.</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending || hasChildren || hasProducts}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
