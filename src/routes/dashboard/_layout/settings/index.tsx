import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import SettingsPage from '@/app/dashboard/settings/page'

export const Route = createFileRoute('/dashboard/_layout/settings/')({
  component: SettingsRoute,
})

function SettingsRoute() {
  const { t } = useTranslation('organization')

  return (
    <>
      <Helmet>
        <title>{t('pages.settings.pageTitle')} | Horyco Admin</title>
      </Helmet>
      <SettingsPage />
    </>
  )
}
