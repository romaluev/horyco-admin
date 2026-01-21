import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import PurchaseOrderDetailPage from '@/app/dashboard/inventory/purchase-orders/[id]/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/purchase-orders/$orderId')({
  component: PurchaseOrderDetailRoute,
})

function PurchaseOrderDetailRoute() {
  const { orderId } = Route.useParams()

  return (
    <>
      <Helmet>
        <title>Закупка | Horyco Admin</title>
      </Helmet>
      <PurchaseOrderDetailPage id={orderId} />
    </>
  )
}
