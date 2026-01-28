import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_layout/staff/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/staff/employees' })
  },
})
