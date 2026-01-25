import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import BranchSetupPage from '@/app/onboarding/branch-setup/page'

export const Route = createFileRoute('/onboarding/branch-setup')({
  component: BranchSetupRoute,
})

function BranchSetupRoute() {
  return (
    <>
      <Helmet>
        <title>Настройка филиала | Horyco Admin</title>
      </Helmet>
      <BranchSetupPage />
    </>
  )
}
