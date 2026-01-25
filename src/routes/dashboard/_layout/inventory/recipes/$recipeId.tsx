import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import RecipeDetailPage from '@/app/dashboard/inventory/recipes/[id]/page'

export const Route = createFileRoute('/dashboard/_layout/inventory/recipes/$recipeId')({
  component: RecipeDetailRoute,
})

function RecipeDetailRoute() {
  const { recipeId } = Route.useParams()

  return (
    <>
      <Helmet>
        <title>Рецепт | Horyco Admin</title>
      </Helmet>
      <RecipeDetailPage id={recipeId} />
    </>
  )
}
