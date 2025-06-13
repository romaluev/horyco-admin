'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductForm from './product-form/product-form';
import { useGetProductById } from '../model/queries';

type TProductViewPageProps = {
  productId: string;
};

export default function ProductViewPage({ productId }: TProductViewPageProps) {
  const { data } = useGetProductById(Number(productId));

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {productId === 'new' ? 'Create New Product' : 'Edit Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm initialData={data} />
      </CardContent>
    </Card>
  );
}
