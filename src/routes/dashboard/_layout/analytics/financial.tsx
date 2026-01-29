import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import FinancialAnalyticsPage from '@/app/dashboard/analytics/financial/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/financial')({
  component: FinancialAnalyticsRoute,
})

function FinancialAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Финансовая аналитика | Horyco Admin</title>
      </Helmet>
      <FinancialAnalyticsPage />
    </>
  )
}
