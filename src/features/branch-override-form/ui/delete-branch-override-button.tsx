/**
 * Delete Branch Override Button
 * Button for deleting branch overrides
 */

'use client';


import { Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/ui/base/alert-dialog';
import { Button } from '@/shared/ui/base/button';

import { useDeleteBranchOverride } from '@/entities/branch-override';

import type { JSX } from 'react';

interface DeleteBranchOverrideButtonProps {
  productId: number;
  branchId: number;
  productName?: string;
  branchName?: string;
}

export const DeleteBranchOverrideButton = ({
  productId,
  branchId,
  productName,
  branchName
}: DeleteBranchOverrideButtonProps) => {
  const { mutate: deleteOverride, isPending } = useDeleteBranchOverride();

  const handleDelete = (): void => {
    deleteOverride({ productId, branchId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить переопределение?</AlertDialogTitle>
          <AlertDialogDescription>
            {productName && branchName ? (
              <>
                Переопределение для &quot;{productName}&quot; в филиале &quot;
                {branchName}&quot; будет удалено. После этого будут
                использоваться базовые настройки продукта.
              </>
            ) : (
              'Переопределение будет удалено. Это действие нельзя отменить.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
