import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import ReceivePurchaseOrderPage from '@/app/dashboard/inventory/purchase-orders/[id]/receive/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/purchase-orders/$orderId/receive')({
  component: ReceivePurchaseOrderRoute,
})

function ReceivePurchaseOrderRoute() {
  const { orderId } = Route.useParams()

  return (
    <>
      <Helmet>
        <title>Приёмка закупки | Horyco Admin</title>
      </Helmet>
      <ReceivePurchaseOrderPage id={orderId} />
    </>
  )
}
