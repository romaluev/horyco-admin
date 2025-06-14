'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IEmployee, useDeleteEmployer } from '../../model';

interface CellActionProps {
  data: IEmployee;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const router = useRouter();

  const { mutateAsync: deleteEmployee, isPending } = useDeleteEmployer();

  const onConfirm = async () => {
    try {
      await deleteEmployee(data.id).then(() => {
        setIsDeleteModalVisible(false);
      });
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
            onClick={() => router.push(`/dashboard/employee/${data.id}`)}
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
