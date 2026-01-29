import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import RecipesPage from '@/app/dashboard/inventory/recipes/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/recipes/')({
  component: RecipesRoute,
})

function RecipesRoute() {
  return (
    <>
      <Helmet>
        <title>Рецепты | Horyco Admin</title>
      </Helmet>
      <RecipesPage />
    </>
  )
}
