'use client';

import { DataTableColumnHeader } from '@/shared/ui/base/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';
import { IEmployee } from '../../model';

export const columns: ColumnDef<IEmployee>[] = [
  {
    id: 'fullName',
    accessorKey: 'fullName',
    header: ({ column }: { column: Column<IEmployee, unknown> }) => (
      <DataTableColumnHeader column={column} title='Имя' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<IEmployee['fullName']>()}</div>,
    meta: {
      label: 'Имя',
      placeholder: 'Поиск сотрудника...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: ({ column }: { column: Column<IEmployee, unknown> }) => (
      <DataTableColumnHeader column={column} title='Телефон' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<IEmployee['phone']>()}</div>,
    meta: {
      label: 'Телефон',
      placeholder: 'Поиск по телефону...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<IEmployee, unknown> }) => (
      <DataTableColumnHeader column={column} title='Дата создания' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<Date>());
      return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
