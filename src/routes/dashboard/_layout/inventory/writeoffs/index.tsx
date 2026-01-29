import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import WriteoffsPage from '@/app/dashboard/inventory/writeoffs/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/writeoffs/')(
  {
    component: WriteoffsRoute,
  }
)

function WriteoffsRoute() {
  return (
    <>
      <Helmet>
        <title>Списания | Horyco Admin</title>
      </Helmet>
      <WriteoffsPage />
    </>
  )
}
