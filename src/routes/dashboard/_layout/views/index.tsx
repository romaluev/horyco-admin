import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import ViewsPage from '@/app/dashboard/views/page'

export const Route = createFileRoute('/dashboard/_layout/views/')({
  component: ViewsRoute,
})

function ViewsRoute() {
  return (
    <>
      <Helmet>
        <title>Представления | Horyco Admin</title>
      </Helmet>
      <ViewsPage />
    </>
  )
}
