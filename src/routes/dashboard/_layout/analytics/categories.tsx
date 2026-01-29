import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import CategoriesAnalyticsPage from '@/app/dashboard/analytics/categories/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/categories')({
  component: CategoriesAnalyticsRoute,
})

function CategoriesAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Аналитика категорий | Horyco Admin</title>
      </Helmet>
      <CategoriesAnalyticsPage />
    </>
  )
}
