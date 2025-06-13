'use client';

import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';
import { useGetAllProducts } from '../model/queries';

type ProductListingPage = {};

export default function ProductListingPage({}: ProductListingPage) {
  const { data } = useGetAllProducts();

  return (
    <ProductTable
      data={data?.items || []}
      totalItems={data?.totalItems || 0}
      columns={[]}
    />
  );
}
