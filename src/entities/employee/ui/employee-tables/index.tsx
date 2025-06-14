'use client';

import { DataTable } from '@/shared/ui/base/table/data-table';

import { useDataTable } from '@/shared/hooks/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

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

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  return (
    <DataTable table={table}>
      {/* TO-DO: Implement filter */}
      {/*<DataTableToolbar table={table} />*/}
    </DataTable>
  );
}
