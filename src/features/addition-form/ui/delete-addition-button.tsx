/**
 * Delete Addition Button Component
 * Button with confirmation dialog for deleting additions
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

import { type IAddition, useDeleteAddition } from '@/entities/addition'

interface DeleteAdditionButtonProps {
  addition: IAddition
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const DeleteAdditionButton = ({
  addition,
  variant = 'outline',
  size = 'sm',
}: DeleteAdditionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: deleteAddition, isPending } = useDeleteAddition()

  const handleDelete = (): void => {
    deleteAddition(addition.id, {
      onSuccess: () => {
        setIsOpen(false)
      },
    })
  }

  const hasItems = (addition.itemsCount ?? 0) > 0

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
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
              Вы уверены, что хотите удалить дополнение{' '}
              <strong>{addition.name}</strong>?
            </p>
            {hasItems && (
              <p className="text-warning">
                ⚠️ Это дополнение содержит {addition.itemsCount} позиций.
              </p>
            )}
            <p>Это действие нельзя отменить.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
