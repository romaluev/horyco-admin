import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import InventoryAlertsPage from '@/app/dashboard/inventory/alerts/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/alerts/')({
  component: InventoryAlertsRoute,
})

function InventoryAlertsRoute() {
  return (
    <>
      <Helmet>
        <title>Оповещения склада | Horyco Admin</title>
      </Helmet>
      <InventoryAlertsPage />
    </>
  )
}
