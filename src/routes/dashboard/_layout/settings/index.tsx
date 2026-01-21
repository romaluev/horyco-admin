import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import SettingsPage from '@/app/dashboard/settings/page'

export const Route = createFileRoute('/dashboard/_layout/settings/')({
  component: SettingsRoute,
})

function SettingsRoute() {
  return (
    <>
      <Helmet>
        <title>Настройки | Horyco Admin</title>
      </Helmet>
      <SettingsPage />
    </>
  )
}
