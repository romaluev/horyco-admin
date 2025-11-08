'use client'

import { useState } from 'react'

import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/base/dropdown-menu'


import { DeleteBranchDialog } from '@/features/branch-delete'
import { UpdateBranchDialog } from '@/features/branch-form'

import type { IBranch } from '../../model'

interface CellActionProps {
  data: IBranch
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Действия</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Действия</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <IconEdit className="mr-2 h-4 w-4" /> Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <IconTrash className="mr-2 h-4 w-4" /> Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateBranchDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        branch={data}
      />

      <DeleteBranchDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        branch={data}
      />
    </>
  )
}
