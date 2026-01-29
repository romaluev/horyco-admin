import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import MenuTemplatePage from '@/app/onboarding/menu-template/page'

export const Route = createFileRoute('/onboarding/menu-template')({
  component: MenuTemplateRoute,
})

function MenuTemplateRoute() {
  return (
    <>
      <Helmet>
        <title>Шаблон меню | Horyco Admin</title>
      </Helmet>
      <MenuTemplatePage />
    </>
  )
}
