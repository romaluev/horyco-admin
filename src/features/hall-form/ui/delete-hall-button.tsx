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
} from '@/shared/ui/base/alert-dialog'
import { Button } from '@/shared/ui/base/button'

import { useCanDeleteHall, useDeleteHall } from '@/entities/hall'

import type { IHall } from '@/entities/hall'

interface IDeleteHallButtonProps {
  hall: IHall
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const DeleteHallButton = ({
  hall,
  variant = 'destructive',
  size = 'default',
}: IDeleteHallButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: canDeleteData } = useCanDeleteHall(hall.id)
  const { mutate: deleteHall, isPending } = useDeleteHall()

  const handleDelete = () => {
    deleteHall(hall.id, {
      onSuccess: () => {
        setIsOpen(false)
      },
    })
  }

  const canDelete = canDeleteData?.canDelete ?? true
  const blockingReason = canDeleteData?.blockingReasons?.tables

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        disabled={!canDelete}
      >
        <IconTrash className="h-4 w-4" />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить зал?</AlertDialogTitle>
            <AlertDialogDescription>
              {canDelete ? (
                <>
                  Are you sure you want to delete hall &ldquo;{hall.name}&rdquo;?
                  Это действие нельзя отменить.
                </>
              ) : (
                <>
                  Cannot delete hall &ldquo;{hall.name}&rdquo;.
                  {blockingReason && <div className="mt-2">{blockingReason}</div>}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {canDelete && (
              <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                {isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
