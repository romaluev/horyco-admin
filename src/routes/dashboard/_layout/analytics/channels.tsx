import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import ChannelsAnalyticsPage from '@/app/dashboard/analytics/channels/page'

export const Route = createFileRoute('/dashboard/_layout/analytics/channels')({
  component: ChannelsAnalyticsRoute,
})

function ChannelsAnalyticsRoute() {
  return (
    <>
      <Helmet>
        <title>Аналитика каналов | Horyco Admin</title>
      </Helmet>
      <ChannelsAnalyticsPage />
    </>
  )
}
