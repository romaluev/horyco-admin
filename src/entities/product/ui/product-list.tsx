'use client';


import { BaseError, BaseLoading } from '@/shared/ui';

import ProductCard from '@/entities/product/ui/product-card';

import type { IProduct } from '@/entities/product';
import type { PaginatedResponse } from '@/shared/types';
import type { UseQueryResult } from '@tanstack/react-query';

interface ProductListProps {
  isLoading?: boolean;
  products?: UseQueryResult<PaginatedResponse<IProduct>>;
  DeleteButton?: React.ComponentType<{ id: number }>;
}

export function ProductList({ products, DeleteButton }: ProductListProps) {
  if (products?.isLoading) return <BaseLoading />;
  if (products?.isError || !products?.data?.items) return <BaseError />;
  return (
    <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
      {products?.data?.items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          DeleteButton={DeleteButton}
        />
      ))}
    </div>
  );
}
