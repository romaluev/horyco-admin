import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import InventoryCountsPage from '@/app/dashboard/inventory/counts/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/counts/')({
  component: InventoryCountsRoute,
})

function InventoryCountsRoute() {
  return (
    <>
      <Helmet>
        <title>Инвентаризации | Horyco Admin</title>
      </Helmet>
      <InventoryCountsPage />
    </>
  )
}
