import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui';

import { useUpdateEmployee } from '@/entities/employee';

import { EmployeeFormBasic } from './employee-form-basic';
import { updateEmployeeSchema } from '../model/contract';

import type { UpdateEmployeeFormData } from '../model/contract';
import type { IEmployee } from '@/entities/employee';

interface UpdateEmployeeDialogProps {
  employee: IEmployee;
}

export const UpdateEmployeeDialog = ({ employee }: UpdateEmployeeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<UpdateEmployeeFormData>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      fullName: employee.fullName,
      email: employee.email || '',
      birthDate: employee.birthDate,
      hireDate: employee.hireDate,
      notes: employee.notes,
    },
  });

  const { mutate: updateEmployee, isPending } = useUpdateEmployee();

  useEffect(() => {
    if (isOpen) {
      form.reset({
        fullName: employee.fullName,
        email: employee.email || '',
        birthDate: employee.birthDate,
        hireDate: employee.hireDate,
        notes: employee.notes,
      });
    }
  }, [isOpen, employee, form]);

  const onSubmit = (data: UpdateEmployeeFormData): void => {
    updateEmployee(
      { id: employee.id, data },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm'>
          <Pencil className='h-4 w-4' />
          Редактировать
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Редактировать сотрудника</DialogTitle>
          <DialogDescription>
            Обновите информацию о сотруднике {employee.fullName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='my-6'>
            <EmployeeFormBasic form={form as any} />
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isPending ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
