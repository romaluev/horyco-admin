'use client';


import { MoreHorizontal } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui';

import {
  ActivateEmployeeButton,
  DeactivateEmployeeButton,
  DeleteEmployeeButton,
} from '@/features/employee-actions';
import { UpdateEmployeeDialog } from '@/features/employee-form';

import type { IEmployee } from '@/entities/employee';
import type { JSX } from 'react'

interface EmployeeTableActionsProps {
  employee: IEmployee;
}

export const EmployeeTableActions = ({ employee }: EmployeeTableActionsProps): JSX.Element => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='flex flex-col gap-2'>
        <DropdownMenuLabel>Действия</DropdownMenuLabel>
        <UpdateEmployeeDialog employee={employee} />
        <ActivateEmployeeButton employee={employee} />
        <DeactivateEmployeeButton employee={employee} />
        <DeleteEmployeeButton employee={employee} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
