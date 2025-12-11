'use client'

import { useDataTable } from '@/shared/hooks/use-data-table'
import { DataTable } from '@/shared/ui/base/table/data-table'
import { DataTableToolbar } from '@/shared/ui/base/table/data-table-toolbar'

import type { ColumnDef } from '@tanstack/react-table'

interface BranchTableParams<TData, TValue> {
  data: TData[]
  totalItems: number
  columns: ColumnDef<TData, TValue>[]
}

export function BranchTable<TData, TValue>({
  data,
  totalItems,
  columns,
}: BranchTableParams<TData, TValue>) {
  const pageSize = 10

  const pageCount = Math.ceil(totalItems / pageSize)

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false, // Setting to false triggers a network request with the updated querystring.
    debounceMs: 500,
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  )
}
