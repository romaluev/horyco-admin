import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import SupplierDetailPage from '@/app/dashboard/inventory/suppliers/[id]/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/suppliers/$supplierId')({
  component: SupplierDetailRoute,
})

function SupplierDetailRoute() {
  return (
    <>
      <Helmet>
        <title>Поставщик | Horyco Admin</title>
      </Helmet>
      <SupplierDetailPage />
    </>
  )
}
