import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import BranchViewPage from '@/features/branches/components/branch-view-page';

export const metadata = {
  title: 'Dashboard : Branch View'
};

type PageProps = { params: Promise<{ branchId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <BranchViewPage branchId={params.branchId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
