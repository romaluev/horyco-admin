'use client';
import { Button } from '@/shared/ui/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/shared/ui/base/dropdown-menu';
import { IconDotsVertical, IconEdit } from '@tabler/icons-react';
import { IEmployee } from '../../model';
import { UpdateEmployeeButton } from '@/features/employee/ui/update-employee-button';
import { DeleteEmployeeButton } from '@/features/employee/ui/delete-employee-button';

interface CellActionProps {
  data: IEmployee;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <IconDotsVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className={'flex flex-col'}>
        <DropdownMenuLabel>Действия</DropdownMenuLabel>
        <UpdateEmployeeButton
          id={data.id}
          Trigger={
            <Button variant='ghost' className='justify-start'>
              <IconEdit className='mr-2 h-4 w-4' /> Обновить
            </Button>
          }
        />
        <DeleteEmployeeButton id={data.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
