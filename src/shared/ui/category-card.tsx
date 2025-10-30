'use client';

import Image from 'next/image';

import { Plus, Check } from 'lucide-react';

import { Badge } from './base/badge';
import { Button } from './base/button';
import { Card, CardContent } from './base/card';
import { cn } from '../lib/utils';

export interface CategoryCardData {
  id: string;
  name: string;
  image: string;
  icon?: string;
  color?: string;
}

interface CategoryCardProps {
  category: CategoryCardData;
  isSelected?: boolean;
  productCount?: number;
  onAdd?: () => void;
  onClick?: () => void;
}

export function CategoryCard({
  category,
  isSelected,
  productCount = 0,
  onAdd,
  onClick
}: CategoryCardProps) {
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

      <div className='relative h-32 w-full overflow-hidden bg-muted'>
        <Image
          src={category.image}
          alt={category.name}
          fill
          className='object-cover transition-transform group-hover:scale-105'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        {category.icon && (
          <div
            className='absolute bottom-2 left-2 flex h-10 w-10 items-center justify-center rounded-lg text-xl backdrop-blur-sm'
            style={{ backgroundColor: `${category.color  }CC` }}
          >
            {category.icon}
          </div>
        )}
      </div>

      <CardContent className='p-3'>
        <div className='mb-2 flex items-center justify-between gap-2'>
          <h3 className='truncate font-semibold text-sm'>{category.name}</h3>
          {productCount > 0 && (
            <span className='text-muted-foreground shrink-0 text-xs'>
              {productCount}
            </span>
          )}
        </div>

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
