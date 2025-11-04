/**
 * Categories Page
 * Main page for managing menu categories with hierarchy and drag-and-drop
 */

'use client'

import type { JSX } from 'react'
import { useState } from 'react'

import { BaseLoading } from '@/shared/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useGetCategories,
  useReorderCategories,
  CategoryTree,
  CategoryList,
} from '@/entities/category'
import { CreateCategoryDialog } from '@/features/category-form'

export default function CategoriesPage(): JSX.Element {
  const [view, setView] = useState<'tree' | 'grid'>('tree')
  const { data: categories, isLoading } = useGetCategories({
    includeProducts: true,
  })
  const { mutate: reorderCategories } = useReorderCategories()

  const handleReorder = (categoryIds: number[]): void => {
    reorderCategories({ categoryIds: categoryIds.map(String) })
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="w-full">
          <BaseLoading />
        </div>
      </PageContainer>
    )
  }

  const topLevelCategories = categories?.filter((cat) => !cat.parentId) || []

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Категории меню
            </h2>
            <p className="text-muted-foreground">
              Управляйте категориями и подкатегориями меню
            </p>
          </div>
          <CreateCategoryDialog />
        </div>

        {/* View Tabs */}
        <Tabs value={view} onValueChange={(v) => setView(v as 'tree' | 'grid')}>
          <TabsList>
            <TabsTrigger value="tree">Дерево</TabsTrigger>
            <TabsTrigger value="grid">Сетка</TabsTrigger>
          </TabsList>

          <TabsContent value="tree" className="space-y-6">
            {topLevelCategories.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <p className="text-muted-foreground text-lg font-medium">
                    Категории не найдены
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Создайте первую категорию для начала работы
                  </p>
                </div>
              </div>
            ) : (
              <CategoryTree
                categories={topLevelCategories}
                onReorder={handleReorder}
                onEdit={(_category) => {
                  // Edit dialog is triggered via the tree item component
                }}
                onDelete={(_categoryId) => {
                  // Delete is handled via the tree item component
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="grid" className="space-y-6">
            <CategoryList
              categories={categories || []}
              isLoading={isLoading}
              onCategoryClick={(_category) => {
                // Handle category click if needed
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Stats */}
        {categories && categories.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border px-6 py-4">
              <p className="text-muted-foreground text-sm font-medium">
                Всего категорий
              </p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
            <div className="rounded-lg border px-6 py-4">
              <p className="text-muted-foreground text-sm font-medium">
                Активных категорий
              </p>
              <p className="text-2xl font-bold">
                {categories.filter((cat) => cat.isActive).length}
              </p>
            </div>
            <div className="rounded-lg border px-6 py-4">
              <p className="text-muted-foreground text-sm font-medium">
                Всего продуктов
              </p>
              <p className="text-2xl font-bold">
                {categories.reduce(
                  (sum, cat) => sum + (cat.productCount || 0),
                  0
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
