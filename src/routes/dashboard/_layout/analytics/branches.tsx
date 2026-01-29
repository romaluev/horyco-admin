import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import BranchesAnalyticsPage from '@/app/dashboard/analytics/branches/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/branches')({
  component: BranchesAnalyticsRoute,
})

function BranchesAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Аналитика филиалов | Horyco Admin</title>
      </Helmet>
      <BranchesAnalyticsPage />
    </>
  )
}
