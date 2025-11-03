import { useState } from 'react';

import { Trash, Loader2 } from 'lucide-react';

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

import { useDeleteEmployee } from '@/entities/employee';

import type { IEmployee } from '@/entities/employee';

interface DeleteEmployeeButtonProps {
  employee: IEmployee;
}

export const DeleteEmployeeButton = ({ employee }: DeleteEmployeeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteEmployee, isPending } = useDeleteEmployee();

  const handleDelete = (): void => {
    deleteEmployee(employee.id, {
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
          <AlertDialogTitle>Удалить сотрудника?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить. Сотрудник {employee.fullName} будет
            удален из системы.
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
