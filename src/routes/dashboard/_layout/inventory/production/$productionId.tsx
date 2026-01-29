import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import ProductionDetailPage from '@/app/dashboard/inventory/production/[id]/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/production/$productionId')({
  component: ProductionDetailRoute,
})

function ProductionDetailRoute() {
  const { productionId } = Route.useParams()

  return (
    <>
      <Helmet>
        <title>Заказ на производство | Horyco Admin</title>
      </Helmet>
      <ProductionDetailPage id={productionId} />
    </>
  )
}
