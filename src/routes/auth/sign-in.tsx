import { createFileRoute, redirect } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'

import SignInViewPage from '@/entities/auth/auth/ui/sign-in-view'

import { getAccessToken } from '@/shared/lib/auth-guard'

export const Route = createFileRoute('/auth/sign-in')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || undefined,
  }),
  beforeLoad: () => {
    const token = getAccessToken()

    // If already logged in, redirect to dashboard (it will handle onboarding check)
    if (token) {
      throw redirect({ to: '/dashboard/overview' as '/' })
    }
  },
  component: SignInPage,
})

function SignInPage() {
  return (
    <>
      <Helmet>
        <title>Авторизация | Horyco Admin</title>
        <meta name="description" content="Вход в систему" />
      </Helmet>
      <SignInViewPage />
    </>
  )
}
