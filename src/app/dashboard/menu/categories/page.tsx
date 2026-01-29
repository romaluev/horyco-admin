/**
 * Categories Page
 * Main page for managing menu categories with hierarchy and drag-and-drop
 */

'use client'

import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { BaseLoading, ViewModeToggler } from '@/shared/ui'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useGetCategories,
  useReorderCategories,
  CategoryTree,
  CategoryList,
} from '@/entities/menu/category'
import { CreateCategoryDialog } from '@/features/menu/category-form'

import type { JSX } from 'react'

export default function CategoriesPage(): JSX.Element {
  const { t } = useTranslation('menu')
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
              {t('pages.categories.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.categories.description')}
            </p>
          </div>
          <CreateCategoryDialog />
        </div>

        {/* Stats */}
        {categories && categories.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border px-6 py-4">
              <p className="text-muted-foreground text-sm font-medium">
                {t('pages.categories.stats.total')}
              </p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
            <div className="rounded-lg border px-6 py-4">
              <p className="text-muted-foreground text-sm font-medium">
                {t('pages.categories.stats.active')}
              </p>
              <p className="text-2xl font-bold">
                {categories.filter((cat) => cat.isActive).length}
              </p>
            </div>
            <div className="rounded-lg border px-6 py-4">
              <p className="text-muted-foreground text-sm font-medium">
                {t('pages.categories.stats.totalProducts')}
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

        {/* View Toggle */}
        <ViewModeToggler value={view} onChange={setView} />

        {/* View Content */}
        {view === 'tree' ? (
          <div className="space-y-6">
            {topLevelCategories.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <p className="text-muted-foreground text-lg font-medium">
                    {t('pages.categories.empty.notFound')}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t('pages.categories.empty.createFirst')}
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
          </div>
        ) : (
          <CategoryList
            categories={categories || []}
            isLoading={isLoading}
            onCategoryClick={(_category) => {
              // Handle category click if needed
            }}
          />
        )}
      </div>
    </PageContainer>
  )
}
