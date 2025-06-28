'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/ui/base/card';
import ProductForm from './product-form/product-form';
import { useGetProductById } from '../model/queries';
import BaseLoading from '@/shared/ui/base-loading';
import { useTranslation } from 'react-i18next';

type TProductViewPageProps = {
  productId: string;
};

export default function ProductViewPage({ productId }: TProductViewPageProps) {
  const { t } = useTranslation();
  const isNew = productId === 'new';
  const {
    data: product,
    isLoading,
    isError
  } = useGetProductById(Number(productId));

  if (!isNew && isLoading) {
    return <BaseLoading className='py-20' />;
  }

  if (isError && !isNew) {
    return (
      <div className='p-4 text-red-500'>
        {t('common.error')}: {isError}
      </div>
    );
  }

  if (!isNew && !product) {
    return <div className='p-4'>{t('dashboard.products.errors.notExist')}</div>;
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {isNew
            ? t('dashboard.products.actions.create')
            : t('dashboard.products.actions.edit')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm initialData={product} />
      </CardContent>
    </Card>
  );
}
