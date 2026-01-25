import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import StockPage from '@/app/dashboard/inventory/stock/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/stock/')({
  component: StockRoute,
})

function StockRoute() {
  return (
    <>
      <Helmet>
        <title>Остатки | Horyco Admin</title>
      </Helmet>
      <StockPage />
    </>
  )
}
