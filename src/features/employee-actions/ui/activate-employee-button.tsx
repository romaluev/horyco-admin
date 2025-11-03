import { useState } from 'react';

import { CheckCircle, Loader2 } from 'lucide-react';

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
} from '@/shared/ui';

import { useActivateEmployee } from '@/entities/employee';

import type { IEmployee } from '@/entities/employee';

interface ActivateEmployeeButtonProps {
  employee: IEmployee;
}

export const ActivateEmployeeButton = ({
  employee,
}: ActivateEmployeeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: activateEmployee, isPending } = useActivateEmployee();

  const handleActivate = (): void => {
    activateEmployee(employee.id, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='ghost' size='sm' disabled={employee.isActive}>
          <CheckCircle className='h-4 w-4' />
          Активировать
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Активировать сотрудника?</AlertDialogTitle>
          <AlertDialogDescription>
            Сотрудник {employee.fullName} будет активирован и сможет войти в
            систему.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleActivate} disabled={isPending}>
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isPending ? 'Активация...' : 'Активировать'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
