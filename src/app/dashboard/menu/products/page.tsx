/**
 * Products Page
 * Main page for managing products with filters and pagination
 * Supports both table and grid views with skeleton loading
 */

'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import PageContainer from '@/shared/ui/layout/page-container'

import { useGetCategories } from '@/entities/category'
import { useGetProducts } from '@/entities/product'

import { ProductsContent } from './products-content'

import type { ProductsPageState } from './products-content'
import type { IProduct } from '@/entities/product'
import type { JSX } from 'react'

export default function ProductsPage(): JSX.Element {
  const router = useRouter()
  const [state, setState] = useState<ProductsPageState>({
    page: 1,
    search: '',
    categoryFilter: 'all',
    availabilityFilter: 'all',
    viewMode: 'grid',
  })

  const limit = 20

  const queryParams = {
    page: state.page,
    limit,
    ...(state.search && { q: state.search }),
    ...(state.categoryFilter !== 'all' && {
      categoryId: Number(state.categoryFilter),
    }),
    ...(state.availabilityFilter !== 'all' && {
      available: state.availabilityFilter === 'available',
    }),
  }

  const { data: productsData, isLoading, error } = useGetProducts(queryParams)
  const { data: categories = [] } = useGetCategories()

  const products = productsData?.data || []
  const total = productsData?.total || 0

  const handleProductEdit = (product: IProduct): void => {
    router.push(`/dashboard/menu/products/${product.id}/edit`)
  }

  const handleStateChange = (updates: Partial<ProductsPageState>): void => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <ProductsContent
          state={state}
          products={products}
          total={total}
          limit={limit}
          isLoading={isLoading}
          error={error}
          categories={categories}
          onStateChange={handleStateChange}
          onProductEdit={handleProductEdit}
        />
      </div>
    </PageContainer>
  )
}
