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

type TProductViewPageProps = {
  productId: string;
};

export default function ProductViewPage({ productId }: TProductViewPageProps) {
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
    return <div className='p-4 text-red-500'>Ошибка: {isError}</div>;
  }

  if (!isNew && !product) {
    return <div className='p-4'>Продукт не существует</div>;
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {isNew ? 'Создать новый продукт' : 'Редактировать продукт'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm initialData={product} />
      </CardContent>
    </Card>
  );
}
