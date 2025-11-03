/**
 * Category Tree Item Component
 * Individual sortable item in category tree
 */

'use client';



import { useState } from 'react'

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, GripVertical } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/base/badge';
import { Button } from '@/shared/ui/base/button';

import { EditCategoryDialog, DeleteCategoryButton } from '@/features/category-form';

import type { ICategory } from '../model';
import type { JSX } from 'react';

interface CategoryTreeItemProps {
  category: ICategory;
  onEdit?: (category: ICategory) => void;
  onDelete?: (categoryId: number) => void;
  onAddChild?: (parentId: number) => void;
  level?: number;
}

export const CategoryTreeItem = ({
  category,
  onEdit,
  onDelete,
  onAddChild,
  level = 0
}: CategoryTreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          'group flex items-center gap-2 rounded-lg border bg-card p-3 transition-colors',
          isDragging && 'opacity-50',
          !category.isActive && 'opacity-60'
        )}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Expand/Collapse */}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </Button>
        ) : (
          <div className="w-6" />
        )}

        {/* Category Image */}
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            className="h-8 w-8 rounded object-cover"
          />
        )}

        {/* Category Name */}
        <div className="flex-1">
          <span className="font-medium">{category.name}</span>
          {category.description && (
            <p className="text-xs text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>

        {/* Product Count */}
        {category.productCount !== undefined && (
          <Badge variant="secondary" className="text-xs">
            {category.productCount}
          </Badge>
        )}

        {/* Status Badge */}
        <Badge variant={category.isActive ? 'default' : 'destructive'}>
          {category.isActive ? 'Активна' : 'Неактивна'}
        </Badge>

        {/* Actions */}
        <div className="flex items-center gap-1 ">
          {onAddChild && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddChild(category.id)}
            >
              Добавить подкатегорию
            </Button>
          )}
          <EditCategoryDialog category={category} />
          <DeleteCategoryButton category={category} />
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-2">
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
