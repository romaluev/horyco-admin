'use client'

import { Text } from 'lucide-react'

import { DataTableColumnHeader } from '@/shared/ui/base/table/data-table-column-header'

import { PinStatusBadge, usePinStatus } from '@/entities/pin'

import type { IEmployee } from '../../model'
import type { Column, ColumnDef } from '@tanstack/react-table'

interface CreateColumnsOptions {
  renderActions?: (employee: IEmployee) => React.ReactNode
}

const PinStatusCell = ({ employeeId }: { employeeId: number }) => {
  const { data: pinStatus, isLoading } = usePinStatus(employeeId)
  return <PinStatusBadge status={pinStatus} isLoading={isLoading} />
}

export const createEmployeeColumns = (
  options?: CreateColumnsOptions
): ColumnDef<IEmployee>[] => {
  const baseColumns: ColumnDef<IEmployee>[] = [
    {
      id: 'name',
      accessorFn: (row) => row.fullName,
      header: ({ column }: { column: Column<IEmployee, unknown> }) => (
        <DataTableColumnHeader column={column} title="Имя" />
      ),
      cell: ({ row }) => <div>{row.original.fullName}</div>,
      meta: {
        label: 'Имя',
        placeholder: 'Поиск сотрудника...',
        variant: 'text',
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: ({ column }: { column: Column<IEmployee, unknown> }) => (
        <DataTableColumnHeader column={column} title="Телефон" />
      ),
      cell: ({ cell }) => <div>{cell.getValue<IEmployee['phone']>()}</div>,
      meta: {
        label: 'Телефон',
        placeholder: 'Поиск по телефону...',
        variant: 'text',
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: 'pinStatus',
      accessorKey: 'id',
      header: ({ column }: { column: Column<IEmployee, unknown> }) => (
        <DataTableColumnHeader column={column} title="PIN" />
      ),
      cell: ({ row }) => <PinStatusCell employeeId={row.original.id} />,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }: { column: Column<IEmployee, unknown> }) => (
        <DataTableColumnHeader column={column} title="Дата создания" />
      ),
      cell: ({ cell }) => {
        const date = new Date(cell.getValue<Date>())
        return <div>{date.toLocaleDateString()}</div>
      },
    },
  ]

  // Add actions column if renderActions is provided
  if (options?.renderActions) {
    baseColumns.push({
      id: 'actions',
      cell: ({ row }) => options.renderActions!(row.original),
    })
  }

  return baseColumns
}

// Export default columns without actions for backward compatibility
export const columns = createEmployeeColumns()
