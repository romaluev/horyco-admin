'use client';
import { AlertModal } from '@/shared/ui/modal/alert-modal';
import { Button } from '@/shared/ui/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/shared/ui/base/dropdown-menu';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IBranch, useDeleteBranch } from '../../model';

interface CellActionProps {
  data: IBranch;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const router = useRouter();

  const { mutateAsync: deleteBranch, isPending } = useDeleteBranch();

  const onConfirm = async () => {
    try {
      await deleteBranch(data.id);
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

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
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/branches/${data.id}`)}
          >
            <IconEdit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteModalVisible(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
