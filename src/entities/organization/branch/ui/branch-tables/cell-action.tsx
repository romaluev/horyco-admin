'use client'

import { useState } from 'react'

import { IconEdit, IconTrash } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'

import { DeleteBranchDialog } from '@/features/organization/branch-delete'
import { UpdateBranchDialog } from '@/features/organization/branch-form'

import type { IBranch } from '../../model'

interface CellActionProps {
  data: IBranch
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
        <IconEdit className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)}>
        <IconTrash className="h-4 w-4" />
      </Button>

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
    </div>
  )
}
