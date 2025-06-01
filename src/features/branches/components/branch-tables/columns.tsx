'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Branch } from '@/api/branches/types';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Branch>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Branch, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Branch['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search branches...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: ({ column }: { column: Column<Branch, unknown> }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Branch['address']>()}</div>,
    meta: {
      label: 'Address',
      placeholder: 'Search by address...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<Branch, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created At' />
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
