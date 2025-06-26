'use client';

import { EmployeeTable } from './employee-tables';
import { columns } from './employee-tables/columns';
import { useGetAllEmployee } from '../model';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useEffect } from 'react';

export default function EmployeeList() {
  const { data: employee } = useGetAllEmployee();
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [page] = useQueryState('page', parseAsInteger.withDefault(10));
  const [fullName] = useQueryState('fullName', parseAsInteger);
  const [phone] = useQueryState('phone', parseAsInteger);

  useEffect(() => {}, [fullName, phone, pageSize, page]);

  return (
    <EmployeeTable
      data={employee?.items || []}
      totalItems={employee?.totalItems || 0}
      columns={columns}
    />
  );
}
