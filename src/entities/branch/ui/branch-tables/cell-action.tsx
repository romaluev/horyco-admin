'use client'
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/base/dropdown-menu'
import { AlertModal } from '@/shared/ui/modal/alert-modal'

import { useDeleteBranch } from '../../model'

import type { IBranch } from '../../model'

interface CellActionProps {
  data: IBranch
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const router = useRouter()

  const { mutateAsync: deleteBranch, isPending } = useDeleteBranch()

  const onConfirm = async () => {
    try {
      await deleteBranch(data.id)
      setIsDeleteModalVisible(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={onConfirm}
        loading={isPending}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Действия</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Действия</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/branches/${data.id}`)}
          >
            <IconEdit className="mr-2 h-4 w-4" /> Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteModalVisible(true)}>
            <IconTrash className="mr-2 h-4 w-4" /> Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
