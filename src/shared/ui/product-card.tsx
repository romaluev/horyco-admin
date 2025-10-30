'use client';

import Image from 'next/image';

import { Plus, Check } from 'lucide-react';

import { Badge } from './base/badge';
import { Button } from './base/button';
import { Card, CardContent } from './base/card';
import { cn } from '../lib/utils';

export interface ProductCardData {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

interface ProductCardProps {
  product: ProductCardData;
  isSelected?: boolean;
  onAdd?: () => void;
  onClick?: () => void;
}

export function ProductCard({ product, isSelected, onAdd, onClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `${new Intl.NumberFormat('ru-RU').format(price)  } сум`;
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden transition-all hover:shadow-lg p-0',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={onClick}
    >
      {isSelected && (
        <Badge className='absolute right-2 top-2 z-10 bg-primary'>
          <Check className='h-3 w-3' />
        </Badge>
      )}

      <div className='relative h-40 w-full overflow-hidden bg-muted'>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className='object-cover transition-transform group-hover:scale-105'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      <CardContent className='p-3'>
        <div className='mb-2 flex items-start justify-between gap-2'>
          <h3 className='line-clamp-1 font-semibold text-sm'>{product.name}</h3>
          <span className='text-primary shrink-0 text-xs font-bold'>
            {formatPrice(product.price)}
          </span>
        </div>

        <p className='text-muted-foreground mb-3 line-clamp-2 text-xs'>
          {product.description}
        </p>

        <Button
          size='sm'
          variant={isSelected ? 'secondary' : 'default'}
          className='w-full h-8 text-xs'
          onClick={(e) => {
            e.stopPropagation();
            onAdd?.();
          }}
        >
          {isSelected ? (
            <>
              <Check className='mr-1 h-3 w-3' />
              Добавлено
            </>
          ) : (
            <>
              <Plus className='mr-1 h-3 w-3' />
              Добавить
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
