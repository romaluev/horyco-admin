'use client';

import PageContainer from '@/shared/ui/layout/page-container';
import { Heading } from '@/shared/ui/base/heading';
import { Separator } from '@/shared/ui/base/separator';
import { DataTableSkeleton } from '@/shared/ui/base/table/data-table-skeleton';
import { Suspense } from 'react';
import { CreateEmployeeButton } from '@/features/employee';
import { EmployeeTable } from '@/entities/employee/ui/employee-tables';
import { columns } from '@/entities/employee/ui/employee-tables/columns';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useGetAllEmployee } from '@/entities/employee/model';

export default function Page() {
  const [size] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [page] = useQueryState('page', parseAsInteger.withDefault(0));

  const { data: employee } = useGetAllEmployee({ size, page });
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Сотрудники'
            description='Управление сотрудниками вашей организации'
          />
          <CreateEmployeeButton />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={4} rowCount={8} filterCount={2} />
          }
        >
          <EmployeeTable
            data={employee?.items || []}
            totalItems={employee?.totalItems || 0}
            columns={columns}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
