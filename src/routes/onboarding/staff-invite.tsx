import { createFileRoute } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import StaffInvitePage from '@/app/onboarding/staff-invite/page'

export const Route = createFileRoute('/onboarding/staff-invite')({
  component: StaffInviteRoute,
})

function StaffInviteRoute() {
  return (
    <>
      <Helmet>
        <title>Приглашение сотрудников | Horyco Admin</title>
      </Helmet>
      <StaffInvitePage />
    </>
  )
}
