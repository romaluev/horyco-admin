import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import SalesOverviewPage from '@/app/dashboard/analytics/sales/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/sales')({
  component: SalesAnalyticsRoute,
})

function SalesAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Аналитика продаж | Horyco Admin</title>
      </Helmet>
      <SalesOverviewPage />
    </>
  )
}
