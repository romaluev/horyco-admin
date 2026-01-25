import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import ModifiersPage from '@/app/dashboard/menu/modifiers/page'

export const Route = createFileRoute('/dashboard/_layout/menu/modifiers')({
  component: ModifiersRoute,
})

function ModifiersRoute() {
  return (
    <>
      <Helmet>
        <title>Модификаторы | Horyco Admin</title>
      </Helmet>
      <ModifiersPage />
    </>
  )
}
