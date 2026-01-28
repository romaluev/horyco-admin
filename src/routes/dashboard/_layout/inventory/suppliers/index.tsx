import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import SuppliersPage from '@/app/dashboard/inventory/suppliers/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/suppliers/')({
  component: SuppliersRoute,
})

function SuppliersRoute() {
  return (
    <>
      <Helmet>
        <title>Поставщики | Horyco Admin</title>
      </Helmet>
      <SuppliersPage />
    </>
  )
}
