import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import InventoryItemsPage from '@/app/dashboard/inventory/items/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/items/')({
  component: InventoryItemsRoute,
})

function InventoryItemsRoute() {
  return (
    <>
      <Helmet>
        <title>Товары склада | Horyco Admin</title>
      </Helmet>
      <InventoryItemsPage />
    </>
  )
}
