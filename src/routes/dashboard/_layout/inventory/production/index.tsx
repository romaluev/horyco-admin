import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import ProductionPage from '@/app/dashboard/inventory/production/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/production/')({
  component: ProductionRoute,
})

function ProductionRoute() {
  return (
    <>
      <Helmet>
        <title>Производство | Horyco Admin</title>
      </Helmet>
      <ProductionPage />
    </>
  )
}
