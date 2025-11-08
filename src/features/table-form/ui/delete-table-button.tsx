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

import { useDeleteTable, useTableSession } from '@/entities/table'

import type { ITable } from '@/entities/table'

interface IDeleteTableButtonProps {
  table: ITable
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const DeleteTableButton = ({
  table,
  variant = 'destructive',
  size = 'sm',
}: IDeleteTableButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: sessionData } = useTableSession(table.id)
  const { mutate: deleteTable, isPending } = useDeleteTable()

  const handleDelete = () => {
    deleteTable(table.id, {
      onSuccess: () => {
        setIsOpen(false)
      },
    })
  }

  const hasActiveSession = sessionData?.hasActiveSession ?? false

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        disabled={hasActiveSession}
      >
        <IconTrash className="h-4 w-4" />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить стол?</AlertDialogTitle>
            <AlertDialogDescription>
              {hasActiveSession ? (
                <>
                  Cannot delete table {table.number}. Close the active session
                  first.
                </>
              ) : (
                <>
                  Are you sure you want to delete table {table.number}? This
                  action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {!hasActiveSession && (
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
