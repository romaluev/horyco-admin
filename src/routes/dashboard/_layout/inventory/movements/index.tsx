import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import MovementsPage from '@/app/dashboard/inventory/movements/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/movements/')({
  component: MovementsRoute,
})

function MovementsRoute() {
  return (
    <>
      <Helmet>
        <title>Движения | Horyco Admin</title>
      </Helmet>
      <MovementsPage />
    </>
  )
}
