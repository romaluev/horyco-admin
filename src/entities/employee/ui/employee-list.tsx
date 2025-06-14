'use client';

import { EmployeeTable } from './employee-tables';
import { columns } from './employee-tables/columns';
import { useGetAllEmployee } from '../model';

export default function EmployeeList() {
  const { data: employee } = useGetAllEmployee();

  return (
    <EmployeeTable
      data={employee?.items || []}
      totalItems={employee?.totalItems || 0}
      columns={columns}
    />
  );
}
