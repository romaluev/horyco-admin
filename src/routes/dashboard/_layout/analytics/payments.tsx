import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import PaymentsAnalyticsPage from '@/app/dashboard/analytics/payments/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/payments')({
  component: PaymentsAnalyticsRoute,
})

function PaymentsAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Аналитика оплат | Horyco Admin</title>
      </Helmet>
      <PaymentsAnalyticsPage />
    </>
  )
}
