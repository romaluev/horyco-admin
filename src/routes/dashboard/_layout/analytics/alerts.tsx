import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import AlertsAnalyticsPage from '@/app/dashboard/analytics/alerts/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/alerts')({
  component: AlertsAnalyticsRoute,
})

function AlertsAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Оповещения аналитики | Horyco Admin</title>
      </Helmet>
      <AlertsAnalyticsPage />
    </>
  )
}
