'use client';

import Image from 'next/image';

import { Edit, Trash2 } from 'lucide-react';

import { Badge } from '@/shared/ui/base/badge';
import { Button } from '@/shared/ui/base/button';
import { Card, CardContent } from '@/shared/ui/base/card';

import type { MockCategory, MockProduct } from '@/shared/lib/mock-menu-data';

interface SelectedItemsListProps {
  selectedCategories: MockCategory[];
  selectedProducts: MockProduct[];
  onEditCategory: (category: MockCategory) => void;
  onEditProduct: (product: MockProduct) => void;
  onRemoveCategory: (categoryId: string) => void;
  onRemoveProduct: (productId: string) => void;
}

export function SelectedItemsList({
  selectedCategories,
  selectedProducts,
  onEditCategory,
  onEditProduct,
  onRemoveCategory,
  onRemoveProduct
}: SelectedItemsListProps) {
  const hasSelections = selectedCategories.length > 0 || selectedProducts.length > 0;

  if (!hasSelections) {
    return (
      <div className='rounded-lg border border-dashed p-8 text-center'>
        <p className='text-muted-foreground text-sm'>
          Выберите категории и продукты для вашего меню
        </p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `${new Intl.NumberFormat('ru-RU').format(price)  } сум`;
  };

  return (
    <div className='space-y-6'>
      {selectedCategories.length > 0 && (
        <div>
          <div className='mb-3 flex items-center gap-2'>
            <h3 className='font-semibold'>Выбранные категории</h3>
            <Badge variant='secondary'>{selectedCategories.length}</Badge>
          </div>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {selectedCategories.map((category) => (
              <Card key={category.id} className='overflow-hidden p-0'>
                <CardContent className='p-4'>
                  <div className='flex items-start gap-3'>
                    {category.icon && (
                      <div
                        className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl'
                        style={{ backgroundColor: `${category.color  }20` }}
                      >
                        {category.icon}
                      </div>
                    )}
                    <div className='min-w-0 flex-1'>
                      <h4 className='truncate font-medium'>{category.name}</h4>
                    </div>
                  </div>
                  <div className='mt-3 flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      className='flex-1'
                      onClick={() => onEditCategory(category)}
                    >
                      <Edit className='mr-1 h-3 w-3' />
                      Изменить
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => onRemoveCategory(category.id)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div>
          <div className='mb-3 flex items-center gap-2'>
            <h3 className='font-semibold'>Выбранные продукты</h3>
            <Badge variant='secondary'>{selectedProducts.length}</Badge>
          </div>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {selectedProducts.map((product) => (
              <Card key={product.id} className='overflow-hidden p-0'>
                <CardContent className='p-4'>
                  <div className='flex gap-3'>
                    <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted'>
                      <Image
                        src={product.image ?? '/placeholder.png'}
                        alt={product.name}
                        fill
                        className='object-cover'
                        sizes='64px'
                      />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h4 className='truncate font-medium'>{product.name}</h4>
                      <p className='text-muted-foreground line-clamp-1 text-xs'>
                        {product.description}
                      </p>
                      <p className='text-primary mt-1 text-sm font-semibold'>
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                  <div className='mt-3 flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      className='flex-1'
                      onClick={() => onEditProduct(product)}
                    >
                      <Edit className='mr-1 h-3 w-3' />
                      Изменить
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => onRemoveProduct(product.id)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
