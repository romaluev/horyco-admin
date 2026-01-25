import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import WarehousesPage from '@/app/dashboard/inventory/warehouses/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/warehouses/')({
  component: WarehousesRoute,
})

function WarehousesRoute() {
  return (
    <>
      <Helmet>
        <title>Склады | Horyco Admin</title>
      </Helmet>
      <WarehousesPage />
    </>
  )
}
