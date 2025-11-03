'use client'

import { _parseAsInteger, _useQueryState } from 'nuqs'

import { useDataTable } from '@/shared/hooks/use-data-table'
import { DataTable } from '@/shared/ui/base/table/data-table'
import { DataTableToolbar } from '@/shared/ui/base/table/data-table-toolbar'

import type { ColumnDef } from '@tanstack/react-table'

interface BranchTableParams<TData, TValue> {
  data: TData[]
  _totalItems: number
  columns: ColumnDef<TData, TValue>[]
}

export function BranchTable<TData, TValue>({
  _data,
  _totalItems,
  columns,
}: BranchTableParams<TData, TValue>) {
  const [pageSize] = _useQueryState('perPage', _parseAsInteger.withDefault(10))

  const pageCount = Math.ceil(_totalItems / pageSize)

  const { table } = useDataTable({
    _data,
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
