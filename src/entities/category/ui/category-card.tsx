/**
 * Category Card Component
 * Display component for a single category
 */

import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/base/badge'
import { Card, CardContent } from '@/shared/ui/base/card'

import {
  EditCategoryDialog,
  DeleteCategoryButton,
} from '@/features/category-form'

import type { ICategory } from '../model'

interface CategoryCardProps {
  category: ICategory
  _onClick?: () => void
  className?: string
}

export const CategoryCard = ({
  category,
  _onClick,
  className,
}: CategoryCardProps) => {
  return (
    <Card
      className={cn(
        'hover:border-primary group relative transition-colors',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {category.productCount !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {category.productCount}{' '}
                  {category.productCount === 1 ? 'продукт' : 'продуктов'}
                </Badge>
              )}
              <Badge
                variant={category.isActive ? 'default' : 'destructive'}
                className="text-xs"
              >
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
  )
}
