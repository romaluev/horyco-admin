import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import { EmployerViewPage } from '@/features/employee/ui';

export const metadata = {
  title: 'Dashboard : Branch View'
};

type PageProps = { params: Promise<{ employerId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <EmployerViewPage employerId={params.employerId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
