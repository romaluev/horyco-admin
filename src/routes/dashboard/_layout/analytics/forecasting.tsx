import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import ForecastingAnalyticsPage from '@/app/dashboard/analytics/forecasting/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/forecasting')({
  component: ForecastingAnalyticsRoute,
})

function ForecastingAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Прогнозирование | Horyco Admin</title>
      </Helmet>
      <ForecastingAnalyticsPage />
    </>
  )
}
