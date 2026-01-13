'use client'

import { useState } from 'react'

import { IconTrash } from '@tabler/icons-react'

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

import { useDeleteInventoryItem } from '@/entities/inventory-item'

interface IDeleteItemButtonProps {
  itemId: number
  itemName: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export const DeleteItemButton = ({
  itemId,
  itemName,
  trigger,
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
        {trigger || (
          <Button variant="ghost" size="icon">
            <IconTrash className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить товар &quot;{itemName}&quot;? Это действие
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
