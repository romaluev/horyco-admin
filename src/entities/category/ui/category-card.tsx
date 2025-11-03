/**
 * Category Card Component
 * Display component for a single category
 */


import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/base/badge';
import { Card, CardContent } from '@/shared/ui/base/card';

import { EditCategoryDialog, DeleteCategoryButton } from '@/features/category-form';

import type { ICategory } from '../model';
import type { JSX } from 'react'

interface CategoryCardProps {
  category: ICategory;
  onClick?: () => void;
  className?: string;
}

export const CategoryCard = ({
  category,
  onClick,
  className
}: CategoryCardProps) => {
  return (
    <Card
      className={cn('transition-colors hover:border-primary relative group', className)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="h-16 w-16 rounded-md object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {category.productCount !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {category.productCount} {category.productCount === 1 ? 'продукт' : 'продуктов'}
                </Badge>
              )}
              <Badge variant={category.isActive ? 'default' : 'destructive'} className="text-xs">
                {category.isActive ? 'Активна' : 'Неактивна'}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <EditCategoryDialog category={category} />
              <DeleteCategoryButton category={category} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
