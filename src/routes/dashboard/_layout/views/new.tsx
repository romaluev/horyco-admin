import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import NewViewPage from '@/app/dashboard/views/new/page'

export const Route = createFileRoute('/dashboard/_layout/views/new')({
  component: NewViewRoute,
})

function NewViewRoute() {
  return (
    <>
      <Helmet>
        <title>Новое представление | Horyco Admin</title>
      </Helmet>
      <NewViewPage />
    </>
  )
}
