'use client'

import { useTranslation } from 'react-i18next'

import { ProductsDataTable } from '@/entities/menu/product/ui/products-data-table'
import { ProductsGridView } from '@/entities/menu/product/ui/products-grid-view'
import { ProductsListSkeleton } from '@/entities/menu/product/ui/products-list-skeleton'

import { ProductsFilters } from './products-filters'
import { ProductsHeader } from './products-header'
import { ProductsStats } from './products-stats'

import type { Category } from './products-filters'
import type { IProduct } from '@/entities/menu/product'
import type { JSX } from 'react'

export type { Category } from './products-filters'

// Local ViewMode type for products (table | grid only)
type ProductViewMode = 'table' | 'grid'

export interface ProductsPageState {
  page: number
  search: string
  categoryFilter: string
  availabilityFilter: string
  viewMode: ProductViewMode
}

interface ProductsContentProps {
  state: ProductsPageState
  products: IProduct[]
  total: number
  limit: number
  isLoading: boolean
  error: Error | null
  categories: Category[]
  onStateChange: (updates: Partial<ProductsPageState>) => void
  onProductEdit: (product: IProduct) => void
}

function ErrorState({ error }: { error: Error | null }): JSX.Element {
  const { t } = useTranslation('menu')

  return (
    <div className="border-destructive bg-destructive/5 rounded-lg border p-6">
      <div className="text-center">
        <p className="text-destructive text-lg font-medium">
          {t('pages.products.messages.loadError')}
        </p>
        <p className="text-muted-foreground text-sm">
          {error?.message || t('pages.products.messages.error')}
        </p>
      </div>
    </div>
  )
}

function EmptyState(): JSX.Element {
  const { t } = useTranslation('menu')

  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
      <div className="text-center">
        <p className="text-muted-foreground text-lg font-medium">
          {t('pages.products.empty.notFound')}
        </p>
        <p className="text-muted-foreground text-sm">
          {t('pages.products.empty.createFirst')}
        </p>
      </div>
    </div>
  )
}

function ProductsList({
  state,
  products,
  total,
  limit,
  onPageChange,
  onProductEdit,
}: {
  state: ProductsPageState
  products: IProduct[]
  total: number
  limit: number
  onPageChange: (page: number) => void
  onProductEdit: (product: IProduct) => void
}): JSX.Element {
  return state.viewMode === 'table' ? (
    <ProductsDataTable
      data={products}
      total={total}
      page={state.page}
      limit={limit}
      onPageChange={onPageChange}
      onEdit={onProductEdit}
    />
  ) : (
    <ProductsGridView
      data={products}
      total={total}
      page={state.page}
      limit={limit}
      onPageChange={onPageChange}
      onEdit={onProductEdit}
    />
  )
}

export function ProductsContent({
  state,
  products,
  total,
  limit,
  isLoading,
  error,
  categories,
  onStateChange,
  onProductEdit,
}: ProductsContentProps): JSX.Element {
  if (isLoading) {
    return <ProductsListSkeleton viewMode={state.viewMode} />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  const handleViewModeChange = (mode: ProductViewMode): void => {
    onStateChange({ viewMode: mode })
  }

  const handleSearchChange = (value: string): void => {
    onStateChange({ search: value, page: 1 })
  }

  const handleCategoryChange = (value: string): void => {
    onStateChange({ categoryFilter: value, page: 1 })
  }

  const handleAvailabilityChange = (value: string): void => {
    onStateChange({ availabilityFilter: value, page: 1 })
  }

  const handlePageChange = (page: number): void => {
    onStateChange({ page })
  }

  return (
    <>
      <ProductsHeader />

      <ProductsFilters
        viewMode={state.viewMode}
        onViewModeChange={handleViewModeChange}
        search={state.search}
        categoryFilter={state.categoryFilter}
        availabilityFilter={state.availabilityFilter}
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onAvailabilityChange={handleAvailabilityChange}
      />

      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ProductsStats
            total={total}
            products={products}
            page={state.page}
            limit={limit}
          />

          <ProductsList
            state={state}
            products={products}
            total={total}
            limit={limit}
            onPageChange={handlePageChange}
            onProductEdit={onProductEdit}
          />
        </>
      )}
    </>
  )
}
