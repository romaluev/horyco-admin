import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import AdditionsPage from '@/app/dashboard/menu/additions/page'

export const Route = createFileRoute('/dashboard/_layout/menu/additions')({
  component: AdditionsRoute,
})

function AdditionsRoute() {
  return (
    <>
      <Helmet>
        <title>Дополнения | Horyco Admin</title>
      </Helmet>
      <AdditionsPage />
    </>
  )
}
