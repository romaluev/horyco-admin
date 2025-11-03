/**
 * Category Tree Component
 * Hierarchical tree view with drag-and-drop support
 */

'use client'

import { useState } from 'react'

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type UniqueIdentifier,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { CategoryTreeItem } from './category-tree-item'

import type { ICategory } from '../model'

interface CategoryTreeProps {
  categories: ICategory[]
  onReorder?: (categoryIds: number[]) => void
  onEdit?: (category: ICategory) => void
  onDelete?: (categoryId: number) => void
  onAddChild?: (parentId: number) => void
}

export const CategoryTree = ({
  categories,
  onReorder,
  onEdit,
  onDelete,
  onAddChild,
}: CategoryTreeProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id)
      const newIndex = categories.findIndex((cat) => cat.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newCategories = [...categories]
        const [removed] = newCategories.splice(oldIndex, 1)
        if (removed) {
          newCategories.splice(newIndex, 0, removed)

          const categoryIds = newCategories.map((cat) => cat.id)
          onReorder?.(categoryIds)
        }
      }
    }

    setActiveId(null)
  }

  const activeCategory = categories.find((cat) => cat.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={categories.map((cat) => cat.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {categories.map((category) => (
            <CategoryTreeItem
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeCategory ? (
          <div className="bg-background border-primary rounded-lg border-2 p-4">
            {activeCategory.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
