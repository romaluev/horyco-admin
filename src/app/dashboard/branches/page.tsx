'use client';

import { Suspense } from 'react';

import Link from 'next/link';

import { IconPlus } from '@tabler/icons-react';

import { cn } from '@/shared/lib/utils';
import { buttonVariants } from '@/shared/ui/base/button';
import { Heading } from '@/shared/ui/base/heading';
import { Separator } from '@/shared/ui/base/separator';
import { DataTableSkeleton } from '@/shared/ui/base/table/data-table-skeleton';
import PageContainer from '@/shared/ui/layout/page-container';

import BranchListingPage from '@/entities/branch/ui/branch-listing';





export default function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={'Филиалы'}
            description={'Управление филиалами вашей организации'}
          />
          <Link
            href='/dashboard/branches/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Добавить филиал
          </Link>
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={4} rowCount={8} filterCount={2} />
          }
        >
          <BranchListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
