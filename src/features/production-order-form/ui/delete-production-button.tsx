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

import { useDeleteProductionOrder } from '@/entities/production-order'

interface IDeleteProductionButtonProps {
  productionId: number
  recipeName: string
  onSuccess?: () => void
}

export const DeleteProductionButton = ({
  productionId,
  recipeName,
  onSuccess,
}: IDeleteProductionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: deleteProduction, isPending } = useDeleteProductionOrder()

  const handleDelete = () => {
    deleteProduction(productionId, {
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
          <AlertDialogTitle>Удалить заказ на производство?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить заказ на производство «{recipeName}»?
            Это действие нельзя отменить.
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
