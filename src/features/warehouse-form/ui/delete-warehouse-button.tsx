'use client'

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

import { useDeleteWarehouse } from '@/entities/warehouse'

interface DeleteWarehouseButtonProps {
  warehouseId: number
  warehouseName: string
}

export function DeleteWarehouseButton({
  warehouseId,
  warehouseName,
}: DeleteWarehouseButtonProps) {
  const { mutate: deleteWarehouse, isPending } = useDeleteWarehouse()

  const handleDelete = () => {
    deleteWarehouse(warehouseId)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить склад?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить склад &quot;{warehouseName}&quot;?
            Это действие нельзя отменить. Склады с остатками удалить нельзя.
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
