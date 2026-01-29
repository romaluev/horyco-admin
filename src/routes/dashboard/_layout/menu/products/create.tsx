import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import CreateProductPage from '@/app/dashboard/menu/products/create/page'

export const Route = createFileRoute('/dashboard/_layout/menu/products/create')({
  component: CreateProductRoute,
})

function CreateProductRoute() {
  return (
    <>
      <Helmet>
        <title>Создание продукта | Horyco Admin</title>
      </Helmet>
      <CreateProductPage />
    </>
  )
}
