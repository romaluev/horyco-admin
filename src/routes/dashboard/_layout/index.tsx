import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_layout/')({
  beforeLoad: () => {
    // Redirect to overview page
    throw redirect({ to: '/dashboard/overview' as '/' })
  },
})
