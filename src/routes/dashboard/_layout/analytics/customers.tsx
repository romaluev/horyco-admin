import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import CustomersAnalyticsPage from '@/app/dashboard/analytics/customers/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/customers')({
  component: CustomersAnalyticsRoute,
})

function CustomersAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Аналитика клиентов | Horyco Admin</title>
      </Helmet>
      <CustomersAnalyticsPage />
    </>
  )
}
