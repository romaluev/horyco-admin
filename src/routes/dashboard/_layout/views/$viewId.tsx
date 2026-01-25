import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import ViewDetailPage from '@/app/dashboard/views/[id]/page'

export const Route = createFileRoute('/dashboard/_layout/views/$viewId')({
  component: ViewDetailRoute,
})

function ViewDetailRoute() {
  const { viewId } = Route.useParams()

  return (
    <>
      <Helmet>
        <title>Представление | Horyco Admin</title>
      </Helmet>
      <ViewDetailPage id={viewId} />
    </>
  )
}
