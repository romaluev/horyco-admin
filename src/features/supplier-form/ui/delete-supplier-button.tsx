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

import { useDeleteSupplier } from '@/entities/supplier'

interface IDeleteSupplierButtonProps {
  supplierId: number
  supplierName: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'icon'
}

export function DeleteSupplierButton({
  supplierId,
  supplierName,
  variant = 'ghost',
  size = 'icon',
}: IDeleteSupplierButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: deleteSupplier, isPending } = useDeleteSupplier()

  const handleDelete = () => {
    deleteSupplier(supplierId, {
      onSuccess: () => {
        setIsOpen(false)
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size}>
          <IconTrash className="h-4 w-4 text-destructive" />
          {size !== 'icon' && <span className="ml-2">Удалить</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить поставщика?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить поставщика &quot;{supplierName}&quot;?
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
