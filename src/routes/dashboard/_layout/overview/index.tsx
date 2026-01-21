import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import PageContainer from '@/shared/ui/layout/page-container'

import { AnalyticsOverview } from '@/widgets/overview'

export const Route = createFileRoute('/dashboard/_layout/overview/')({
  component: OverviewPage,
})

function OverviewPage() {
  return (
    <>
      <Helmet>
        <title>Панель управления | Horyco Admin</title>
        <meta name="description" content="Обзор ключевых показателей ресторана" />
      </Helmet>
      <PageContainer>
        <AnalyticsOverview />
      </PageContainer>
    </>
  )
}
