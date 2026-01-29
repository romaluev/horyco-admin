import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import { BaseLoading, ViewModeToggler } from '@/shared/ui'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useGetCategories,
  useReorderCategories,
  CategoryTree,
  CategoryList,
} from '@/entities/menu/category'
import { CreateCategoryDialog } from '@/features/menu/category-form'

export const Route = createFileRoute('/dashboard/_layout/menu/categories')({
  component: CategoriesPage,
})

function CategoriesPage() {
  const [view, setView] = useState<'tree' | 'grid'>('grid')
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
        <Helmet>
          <title>Категории | Horyco Admin</title>
        </Helmet>
        <div className="w-full">
          <BaseLoading />
        </div>
      </PageContainer>
    )
  }

  const topLevelCategories = categories?.filter((cat) => !cat.parentId) || []

  return (
    <>
      <Helmet>
        <title>Категории | Horyco Admin</title>
      </Helmet>
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

          <ViewModeToggler value={view} onChange={setView} />

          {view === 'tree' ? (
            <div className="space-y-6">
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
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              )}
            </div>
          ) : (
            <CategoryList
              categories={categories || []}
              isLoading={isLoading}
              onCategoryClick={() => {}}
            />
          )}
        </div>
      </PageContainer>
    </>
  )
}
