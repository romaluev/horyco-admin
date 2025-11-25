'use client'

import { ProductsDataTable } from '@/entities/product/ui/products-data-table'
import { ProductsGridView } from '@/entities/product/ui/products-grid-view'
import { ProductsListSkeleton } from '@/entities/product/ui/products-list-skeleton'

import { ProductsFilters } from './products-filters'
import { ProductsHeader } from './products-header'
import { ProductsStats } from './products-stats'

import type { IProduct } from '@/entities/product'
import type { JSX } from 'react'
import type { Category } from './products-filters'

export type { Category } from './products-filters'

type ViewMode = 'table' | 'grid'

export interface ProductsPageState {
  page: number
  search: string
  categoryFilter: string
  availabilityFilter: string
  viewMode: ViewMode
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
  return (
    <div className="rounded-lg border border-destructive bg-destructive/5 p-6">
      <div className="text-center">
        <p className="text-lg font-medium text-destructive">
          Ошибка загрузки продуктов
        </p>
        <p className="text-sm text-muted-foreground">
          {error?.message || 'Неизвестная ошибка'}
        </p>
      </div>
    </div>
  )
}

function EmptyState(): JSX.Element {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
      <div className="text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Продукты не найдены
        </p>
        <p className="text-sm text-muted-foreground">
          Создайте первый продукт или измените фильтры
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

  if (products.length === 0) {
    return <EmptyState />
  }

  const handleViewModeChange = (mode: ViewMode): void => {
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
      <ProductsHeader
        viewMode={state.viewMode}
        onViewModeChange={handleViewModeChange}
      />

      <ProductsFilters
        search={state.search}
        categoryFilter={state.categoryFilter}
        availabilityFilter={state.availabilityFilter}
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onAvailabilityChange={handleAvailabilityChange}
      />

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
  )
}
