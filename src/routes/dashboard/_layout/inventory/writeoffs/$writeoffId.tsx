import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import WriteoffDetailPage from '@/app/dashboard/inventory/writeoffs/[id]/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/writeoffs/$writeoffId')({
  component: WriteoffDetailRoute,
})

function WriteoffDetailRoute() {
  return (
    <>
      <Helmet>
        <title>Списание | Horyco Admin</title>
      </Helmet>
      <WriteoffDetailPage />
    </>
  )
}
