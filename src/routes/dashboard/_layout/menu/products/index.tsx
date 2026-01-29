import { useState } from 'react'

import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import PageContainer from '@/shared/ui/layout/page-container'

import { ProductsContent } from '@/app/dashboard/menu/products/products-content'
import { useGetCategories } from '@/entities/menu/category'
import { useGetProducts } from '@/entities/menu/product'


import type { ProductsPageState } from '@/app/dashboard/menu/products/products-content'
import type { IProduct } from '@/entities/menu/product'

export const Route = createFileRoute('/dashboard/_layout/menu/products/')({
  component: ProductsPage,
})

function ProductsPage() {
  const navigate = useNavigate()
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
    navigate({ to: `/dashboard/menu/products/${product.id}/edit` })
  }

  const handleStateChange = (updates: Partial<ProductsPageState>): void => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  return (
    <>
      <Helmet>
        <title>Продукты | Horyco Admin</title>
      </Helmet>
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
    </>
  )
}
