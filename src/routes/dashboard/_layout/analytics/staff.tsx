import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import StaffAnalyticsPage from '@/app/dashboard/analytics/staff/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/staff')({
  component: StaffAnalyticsRoute,
})

function StaffAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Аналитика сотрудников | Horyco Admin</title>
      </Helmet>
      <StaffAnalyticsPage />
    </>
  )
}
