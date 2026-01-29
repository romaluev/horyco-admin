import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import ProductsAnalyticsPage from '@/app/dashboard/analytics/products/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/products')({
  component: ProductsAnalyticsRoute,
})

function ProductsAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Аналитика продуктов | Horyco Admin</title>
      </Helmet>
      <ProductsAnalyticsPage />
    </>
  )
}
