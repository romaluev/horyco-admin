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
import { useTranslation } from 'react-i18next';

interface CellActionProps {
  data: IBranch;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { t } = useTranslation();
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
            <span className='sr-only'>
              {t('dashboard.branches.table.actions.menu')}
            </span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>
            {t('dashboard.branches.table.actions.menu')}
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/branches/${data.id}`)}
          >
            <IconEdit className='mr-2 h-4 w-4' />{' '}
            {t('dashboard.branches.table.actions.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteModalVisible(true)}>
            <IconTrash className='mr-2 h-4 w-4' />{' '}
            {t('dashboard.branches.table.actions.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
