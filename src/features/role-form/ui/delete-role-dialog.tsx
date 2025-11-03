import { useState } from 'react';

import { Loader2, Trash } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  buttonVariants,
} from '@/shared/ui';

import { useDeleteRole } from '@/entities/role';

import type { IRole } from '@/entities/role';

interface DeleteRoleDialogProps {
  role: IRole;
}

export const DeleteRoleDialog = ({ role }: DeleteRoleDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteRole, isPending } = useDeleteRole();

  const handleDelete = (): void => {
    deleteRole(role.id, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='ghost' size='sm' className='text-destructive'>
          <Trash className='h-4 w-4' />
          Удалить
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить роль?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить. Роль "{role.name}" будет удалена. Убедитесь, что ни один
            сотрудник не использует эту роль.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={cn(buttonVariants({ variant: 'destructive' }))}
            disabled={isPending}
          >
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isPending ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
