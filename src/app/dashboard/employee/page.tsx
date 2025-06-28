'use client';

import PageContainer from '@/shared/ui/layout/page-container';
import { buttonVariants } from '@/shared/ui/base/button';
import { Heading } from '@/shared/ui/base/heading';
import { EmployeeList } from '@/entities/employee/ui';
import { Separator } from '@/shared/ui/base/separator';
import { DataTableSkeleton } from '@/shared/ui/base/table/data-table-skeleton';
import { cn } from '@/shared/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={t('dashboard.employee.title')}
            description={t('dashboard.employee.description')}
          />
          <Link
            href='/dashboard/employee/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' />{' '}
            {t('dashboard.employee.addNew')}
          </Link>
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={4} rowCount={8} filterCount={2} />
          }
        >
          <EmployeeList />
        </Suspense>
      </div>
    </PageContainer>
  );
}
