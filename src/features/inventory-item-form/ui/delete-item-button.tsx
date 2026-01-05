'use client'

import { useState } from 'react'

import { IconTrash } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
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

import { useDeleteInventoryItem } from '@/entities/inventory-item'

interface IDeleteItemButtonProps {
  itemId: number
  itemName: string
  onSuccess?: () => void
}

export const DeleteItemButton = ({
  itemId,
  itemName,
  onSuccess,
}: IDeleteItemButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: deleteItem, isPending } = useDeleteInventoryItem()

  const handleDelete = () => {
    deleteItem(itemId, {
      onSuccess: () => {
        setIsOpen(false)
        onSuccess?.()
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive">
          <IconTrash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить товар «{itemName}»? Это действие
            нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
