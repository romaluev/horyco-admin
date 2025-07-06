import FormCardSkeleton from '@/shared/ui/form-card-skeleton';
import PageContainer from '@/shared/ui/layout/page-container';
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import { CreateProductForm, UpdateProductForm } from '@/features/product-form';

export const metadata = {
  title: 'Dashboard : Product View'
};

type PageProps = { params: Promise<{ productId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  const isNew = params.productId === 'new';

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <Card className='mx-auto w-full'>
            <CardHeader>
              <CardTitle className='text-left text-2xl font-bold'>
                {isNew ? 'Создать новый продукт' : 'Редактировать продукт'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isNew ? (
                <CreateProductForm />
              ) : (
                <UpdateProductForm productId={Number(params.productId)} />
              )}
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </PageContainer>
  );
}
