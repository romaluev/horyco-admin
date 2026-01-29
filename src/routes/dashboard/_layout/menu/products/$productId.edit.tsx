import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import EditProductPage from '@/app/dashboard/menu/products/[id]/edit/page'

export const Route = createFileRoute('/dashboard/_layout/menu/products/$productId/edit')({
  component: EditProductRoute,
})

function EditProductRoute() {
  const { productId } = Route.useParams()

  return (
    <>
      <Helmet>
        <title>Редактирование продукта | Horyco Admin</title>
      </Helmet>
      <EditProductPage id={productId} />
    </>
  )
}
