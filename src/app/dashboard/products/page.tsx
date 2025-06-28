'use client';

import PageContainer from '@/shared/ui/layout/page-container';
import { buttonVariants } from '@/shared/ui/base/button';
import { Heading } from '@/shared/ui/base/heading';
import { Separator } from '@/shared/ui/base/separator';
import { cn } from '@/shared/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { BaseFilter, BasePagination } from '@/widgets/ListItems';
import BaseLoading from '@/shared/ui/base-loading';
import ProductCard from '@/entities/product/ui/product-card';
import { useGetAllProducts } from '@/entities/product/model';
import { ApiParams } from '@/shared/types';
import { useTranslation } from 'react-i18next';

const filterProperties: { value: string; label: string }[] = [
  {
    value: 'name',
    label: 'name'
  }
];

export default function Page() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState('');
  const [pagination, setPagination] = useState<{
    page: number;
    size: number;
  } | null>(null);

  const params = useMemo(() => {
    let params: ApiParams = {};

    if (filters) params.filters = filters;
    // if (pagination) params = { ...params, ...pagination };

    return params;
  }, [filters, pagination]);

  const { data: products, isLoading } = useGetAllProducts();

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={t('dashboard.products.title')}
            description={t('dashboard.products.description')}
          />
          <div className='flex gap-2'>
            <Link
              href='/dashboard/products/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <IconPlus className='mr-2 h-4 w-4' />{' '}
              {t('dashboard.products.actions.addNew')}
            </Link>
            <BaseFilter
              properties={filterProperties.map((prop) => ({
                ...prop,
                label: t(`dashboard.products.form.${prop.value}.label`)
              }))}
              onChange={(value) => setFilters(value)}
            />
          </div>
        </div>
        <Separator />
        <Suspense fallback={<BaseLoading className='py-20' />}>
          <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4'>
            {products?.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Suspense>
      </div>
    </PageContainer>
  );
}
