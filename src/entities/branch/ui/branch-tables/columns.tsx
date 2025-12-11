'use client'

import { Text } from 'lucide-react'

import { DataTableColumnHeader } from '@/shared/ui/base/table/data-table-column-header'
import { ViewBranchButton } from '@/shared/ui/view-branch-button'

import { CellAction } from './cell-action'

import type { IBranch } from '../../model'
import type { Column, ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<IBranch>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<IBranch, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<IBranch['name']>()}</div>,
    meta: {
      label: 'Название',
      placeholder: 'Поиск филиалов...',
      variant: 'text',
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: 'Адрес',
    accessorKey: 'address',
    header: ({ column }: { column: Column<IBranch, unknown> }) => (
      <DataTableColumnHeader column={column} title="Адрес" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<IBranch['address']>()}</div>,
    meta: {
      label: 'Адрес',
      placeholder: 'Поиск по адресу...',
      variant: 'text',
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: 'Дата создание',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<IBranch, unknown> }) => (
      <DataTableColumnHeader column={column} title="Дата создание" />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<Date>())
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: 'view',
    header: 'Просмотр',
    cell: ({ row }) => <ViewBranchButton branchId={row.original.id} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
