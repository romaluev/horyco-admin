import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import InventoryItemDetailPage from '@/app/dashboard/inventory/items/[id]/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/items/$itemId')({
  component: InventoryItemDetailRoute,
})

function InventoryItemDetailRoute() {
  const { itemId } = Route.useParams()

  return (
    <>
      <Helmet>
        <title>Товар склада | Horyco Admin</title>
      </Helmet>
      <InventoryItemDetailPage id={itemId} />
    </>
  )
}
