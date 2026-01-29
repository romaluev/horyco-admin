import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import BusinessInfoPage from '@/app/onboarding/business-info/page'

export const Route = createFileRoute('/onboarding/business-info')({
  component: BusinessInfoRoute,
})

function BusinessInfoRoute() {
  return (
    <>
      <Helmet>
        <title>Информация о бизнесе | Horyco Admin</title>
      </Helmet>
      <BusinessInfoPage />
    </>
  )
}
