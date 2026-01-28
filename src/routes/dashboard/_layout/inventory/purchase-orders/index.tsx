import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import PurchaseOrdersPage from '@/app/dashboard/inventory/purchase-orders/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/purchase-orders/')({
  component: PurchaseOrdersRoute,
})

function PurchaseOrdersRoute() {
  return (
    <>
      <Helmet>
        <title>Закупки | Horyco Admin</title>
      </Helmet>
      <PurchaseOrdersPage />
    </>
  )
}
