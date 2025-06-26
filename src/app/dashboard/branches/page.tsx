import PageContainer from '@/shared/ui/layout/page-container';
import { buttonVariants } from '@/shared/ui/base/button';
import { Heading } from '@/shared/ui/base/heading';
import { Separator } from '@/shared/ui/base/separator';
import { DataTableSkeleton } from '@/shared/ui/base/table/data-table-skeleton';
import BranchListingPage from '@/entities/branch/ui/branch-listing';
import { searchParamsCache } from '@/shared/lib/searchparams';
import { cn } from '@/shared/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Branches'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);
  //
  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Branches'
            description='Manage branches for your organization'
          />
          <Link
            href='/dashboard/branches/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          // key={key}
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
