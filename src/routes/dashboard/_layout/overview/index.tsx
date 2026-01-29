import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import PageContainer from '@/shared/ui/layout/page-container'

import { AnalyticsOverview } from '@/widgets/overview'

export const Route = createFileRoute('/dashboard/_layout/overview/')({
  component: OverviewPage,
})

function OverviewPage() {
  const { t } = useTranslation('dashboard')

  return (
    <>
      <Helmet>
        <title>{t('title')} | Horyco Admin</title>
        <meta name="description" content={t('overview.description')} />
      </Helmet>
      <PageContainer>
        <AnalyticsOverview />
      </PageContainer>
    </>
  )
}
