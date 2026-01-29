import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import HeatmapAnalyticsPage from '@/app/dashboard/analytics/heatmap/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/heatmap')({
  component: HeatmapAnalyticsRoute,
})

function HeatmapAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Тепловая карта | Horyco Admin</title>
      </Helmet>
      <HeatmapAnalyticsPage />
    </>
  )
}
