import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import { ProfileView } from '@/entities/auth/auth'

export const Route = createFileRoute('/dashboard/_layout/profile/')({
  component: ProfileRoute,
})

function ProfileRoute() {
  return (
    <>
      <Helmet>
        <title>Профиль | Horyco Admin</title>
      </Helmet>
      <ProfileView />
    </>
  )
}
