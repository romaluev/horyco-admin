'use client';

import PageContainer from '@/shared/ui/layout/page-container';
import { buttonVariants } from '@/shared/ui/base/button';
import { Heading } from '@/shared/ui/base/heading';
import { Separator } from '@/shared/ui/base/separator';
import { cn } from '@/shared/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BaseFilter } from '@/widgets/ListItems';
import { useGetAllProducts } from '@/entities/product/model';
import { ApiParams } from '@/shared/types';
import { ProductList } from '@/entities/product';
import { DeleteProductButton } from '@/features/product-form';
import { AiImportButton } from '@/features/product-form/ui/ai-import-button';

const filterProperties: { value: string; label: string }[] = [
  {
    value: 'name',
    label: 'Название'
  }
];

export default function Page() {
  const [filters, setFilters] = useState('');
  const [pagination, setPagination] = useState<{
    page: number;
    size: number;
  } | null>(null);

  const params = useMemo(() => {
    const params: ApiParams = {};

    if (filters) params.filters = filters;
    // if (pagination) params = { ...params, ...pagination };

    return params;
  }, [filters, pagination]);

  const products = useGetAllProducts();

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex flex-wrap-reverse items-start justify-between gap-2'>
          <Heading
            title='Продукты'
            description='Управление продуктами (Серверные функции таблицы.)'
          />
          <div className='flex flex-wrap gap-2'>
            <AiImportButton />
            <Link
              href='/dashboard/products/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <IconPlus className='mr-2 h-4 w-4' /> Добавить новый
            </Link>
            <BaseFilter
              properties={filterProperties.map((prop) => ({
                ...prop,
                label: 'Фильтры'
              }))}
              onChange={(value) => setFilters(value)}
            />
          </div>
        </div>
        <Separator />
        <ProductList DeleteButton={DeleteProductButton} products={products} />
      </div>
    </PageContainer>
  );
}
