'use client';



import { parseAsInteger, useQueryState } from 'nuqs';

import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable } from '@/shared/ui/base/table/data-table';
import { DataTableToolbar } from '@/shared/ui/base/table/data-table-toolbar';

import type { ColumnDef } from '@tanstack/react-table';

interface EmployeeTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

export function EmployeeTable<TData, TValue>({
  data,
  totalItems,
  columns
}: EmployeeTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / pageSize),
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
