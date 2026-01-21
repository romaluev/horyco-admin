import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import InventoryCountDetailPage from '@/app/dashboard/inventory/counts/[id]/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/counts/$countId')({
  component: InventoryCountDetailRoute,
})

function InventoryCountDetailRoute() {
  const { countId } = Route.useParams()

  return (
    <>
      <Helmet>
        <title>Инвентаризация | Horyco Admin</title>
      </Helmet>
      <InventoryCountDetailPage id={countId} />
    </>
  )
}
