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

import { useDeleteSupplier } from '@/entities/supplier'

interface IDeleteSupplierButtonProps {
  supplierId: number
  supplierName: string
  onSuccess?: () => void
}

export const DeleteSupplierButton = ({
  supplierId,
  supplierName,
  onSuccess,
}: IDeleteSupplierButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: deleteSupplier, isPending } = useDeleteSupplier()

  const handleDelete = () => {
    deleteSupplier(supplierId, {
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
          <AlertDialogTitle>Удалить поставщика?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить поставщика «{supplierName}»? Это
            действие нельзя отменить.
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
