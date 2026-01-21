import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import CompletePage from '@/app/onboarding/complete/page'

export const Route = createFileRoute('/onboarding/complete')({
  component: CompleteRoute,
})

function CompleteRoute() {
  return (
    <>
      <Helmet>
        <title>Регистрация завершена | Horyco Admin</title>
      </Helmet>
      <CompletePage />
    </>
  )
}
