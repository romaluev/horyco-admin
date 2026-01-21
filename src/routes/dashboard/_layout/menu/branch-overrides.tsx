import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import BranchOverridesPage from '@/app/dashboard/menu/branch-overrides/page'

export const Route = createFileRoute('/dashboard/_layout/menu/branch-overrides')({
  component: BranchOverridesRoute,
})

function BranchOverridesRoute() {
  return (
    <>
      <Helmet>
        <title>Переопределения филиалов | Horyco Admin</title>
      </Helmet>
      <BranchOverridesPage />
    </>
  )
}
