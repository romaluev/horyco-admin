'use client'

import React, { useState } from 'react'

import { IconEdit, IconTrash } from '@tabler/icons-react'

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import { HallForm } from './hall-form'
import { useDeleteHall } from '../model/mutations'
import { useGetAllHalls } from '../model/queries'

import type { IHall } from '../model/types'

export const HallTable = () => {
  const { data: response, isLoading } = useGetAllHalls()
  const { mutate: deleteHall } = useDeleteHall()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentHall, setCurrentHall] = useState<IHall | null>(null)

  if (isLoading) {
    return <div>Загрузка залов...</div>
  }

  const handleEdit = (hall: IHall) => {
    setCurrentHall(hall)
    setIsFormOpen(true)
  }

  const handleDelete = (hall: IHall) => {
    setCurrentHall(hall)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (currentHall) {
      deleteHall(String(currentHall.id))
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Этаж</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {response?.items &&
            response.items.map((hall: IHall) => (
              <TableRow key={hall.id}>
                <TableCell>{hall.id}</TableCell>
                <TableCell>{hall.name}</TableCell>
                <TableCell>{hall.floor}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(hall)}
                  >
                    <IconEdit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(hall)}
                  >
                    <IconTrash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Диалог с формой редактирования */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentHall ? 'Редактирование зала' : 'Добавление зала'}
            </DialogTitle>
          </DialogHeader>
          <HallForm
            initialData={currentHall}
            onSuccess={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить зал?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить зал &ldquo;{currentHall?.name}
              &rdquo;? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
