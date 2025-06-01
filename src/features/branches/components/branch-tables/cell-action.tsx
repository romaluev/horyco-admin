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
import { Branch } from '@/api/branches/types';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useBranchesStore } from '../../store/branches-store';

interface CellActionProps {
  data: Branch;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const router = useRouter();

  // Get deleteBranch action and isLoading state from the branches store
  const { deleteBranch, isLoading } = useBranchesStore();

  const onConfirm = async () => {
    try {
      // Use the store action to delete the branch
      const success = await deleteBranch(data.id);
      if (success) {
        setIsDeleteModalVisible(false);
        // No need to refresh the router as the store will update the state
      }
    } catch (error) {
      console.error(error);
      // Error handling is done in the store action
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={onConfirm}
        loading={isLoading}
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
