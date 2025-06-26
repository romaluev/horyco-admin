'use client';

import ProductCard from '@/entities/product/ui/product-card';
import { IProduct } from '@/entities/product/model';

type ProductListingPage = {
  products: IProduct[];
};

export default function ProductListingPage({ products }: ProductListingPage) {
  return (
    <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
