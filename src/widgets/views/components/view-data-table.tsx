'use client'

import * as React from 'react'

import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { formatPrice } from '@/shared/lib/format'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { DataTable } from '@/shared/ui/base/table/data-table'
import { DataTableColumnHeader } from '@/shared/ui/base/table/data-table-column-header'

import { useViewData } from '@/entities/view'
import { selectAvailableColumns, useViewBuilderStore } from '@/features/view-builder'

import type { IColumnDef, IViewDataParams } from '@/entities/view'
import type { IRankedItem } from '@/shared/api/graphql'

interface IViewDataTableProps {
  params: IViewDataParams
}

// Mapping from logical column keys to API field names
// The rankedList API returns a simplified structure
const COLUMN_TO_API_FIELD: Record<string, keyof IRankedItem> = {
  rank: 'rank',
  id: 'id',
  name: 'name',
  revenue: 'value', // Maps to value from API
  orders: 'secondaryValue', // Maps to secondaryValue
  quantity: 'secondaryValue',
  value: 'value',
  percentage: 'percentage',
  formattedValue: 'formattedValue',
}

export function ViewDataTable({ params }: IViewDataTableProps) {
  const { workingConfig } = useViewBuilderStore()
  const availableColumns = useViewBuilderStore(selectAvailableColumns)

  const { data, isLoading } = useViewData(params)

  // Build dynamic columns based on workingConfig.columns
  const columns = React.useMemo<ColumnDef<IRankedItem>[]>(() => {
    const visibleColumnDefs = availableColumns.filter((col) =>
      workingConfig.columns.includes(col.key)
    )

    return visibleColumnDefs.map((colDef) => createColumnDef(colDef))
  }, [availableColumns, workingConfig.columns])

  const tableData = React.useMemo(() => data || [], [data])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <ViewDataTableSkeleton />
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">Нет данных для отображения</p>
      </div>
    )
  }

  return <DataTable table={table} />
}

// Helper function to create column definitions
function createColumnDef(colDef: IColumnDef): ColumnDef<IRankedItem> {
  // Map the logical column key to the actual API field
  const apiField = COLUMN_TO_API_FIELD[colDef.key] || colDef.key

  return {
    id: colDef.key,
    accessorKey: apiField,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={colDef.label} />
    ),
    cell: ({ getValue, row }) => {
      // For revenue/value columns, use formattedValue if available
      if (colDef.type === 'currency' && row.original.formattedValue) {
        return row.original.formattedValue
      }
      const value = getValue()
      return formatCellValue(value, colDef.type)
    },
    enableSorting: colDef.sortable,
  }
}

// Format cell value based on column type
function formatCellValue(
  value: unknown,
  type: IColumnDef['type']
): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">-</span>
  }

  switch (type) {
    case 'currency':
      return formatPrice(Number(value))

    case 'percentage':
      return `${Number(value).toFixed(1)}%`

    case 'number':
      return Number(value).toLocaleString('ru-RU')

    case 'date':
      if (typeof value === 'string') {
        return new Date(value).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      }
      return String(value)

    case 'status':
      return (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {String(value)}
        </span>
      )

    default:
      return String(value)
  }
}

// Skeleton loader
function ViewDataTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <div className="border-b bg-muted p-3">
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </div>
        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-24" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
