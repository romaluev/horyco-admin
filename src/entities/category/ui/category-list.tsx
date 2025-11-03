/**
 * Category List Component
 * Simple list view of categories
 */

'use client';


import { BaseLoading } from '@/shared/ui';

import { CategoryCard } from './category-card';

import type { ICategory } from '../model';
import type { JSX } from 'react'

interface CategoryListProps {
  categories: ICategory[];
  isLoading?: boolean;
  onCategoryClick?: (category: ICategory) => void;
}

export const CategoryList = ({
  categories,
  isLoading,
  onCategoryClick
}: CategoryListProps) => {
  if (isLoading) {
    return <BaseLoading />;
  }

  if (categories.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Категории не найдены
          </p>
          <p className="text-sm text-muted-foreground">
            Создайте первую категорию
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onClick={() => onCategoryClick?.(category)}
        />
      ))}
    </div>
  );
};
