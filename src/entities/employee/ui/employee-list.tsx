'use client';

import { EmployeeTable } from './employee-tables';
import { columns } from './employee-tables/columns';
import { useGetAllEmployee } from '../model';
import { parseAsInteger, useQueryState } from 'nuqs';

export default function EmployeeList() {
  const [size] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [page] = useQueryState('page', parseAsInteger.withDefault(0));

  const { data: employee } = useGetAllEmployee({ size, page });

  return (
    <EmployeeTable
      data={employee?.items || []}
      totalItems={employee?.totalItems || 0}
      columns={columns}
    />
  );
}
