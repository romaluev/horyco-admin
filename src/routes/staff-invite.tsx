import { Suspense } from 'react'

import { createFileRoute, Link } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { Loader2 } from 'lucide-react'

import logo from '@/shared/assets/logo.png'

import StaffInviteForm from '@/entities/auth/auth/ui/staff-invite-form'

export const Route = createFileRoute('/staff-invite')({
  component: StaffInvitePage,
})

function StaffInviteFormFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
    </div>
  )
}

function StaffInvitePage() {
  return (
    <>
      <Helmet>
        <title>Активация аккаунта сотрудника | Horyco Admin</title>
        <meta name="description" content="Активируйте ваш аккаунт сотрудника Horyco" />
      </Helmet>
      <div className="relative grid h-screen grid-rows-[auto_1fr] items-center justify-center lg:max-w-none">
        <div className="flex items-center justify-center p-4 text-lg font-medium">
          <img
            className="w-32 overflow-hidden rounded-2xl"
            src={logo}
            alt="Horyco"
          />
        </div>
        <div className="flex h-full items-center justify-center p-4 lg:p-8">
          <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
            <Suspense fallback={<StaffInviteFormFallback />}>
              <StaffInviteForm />
            </Suspense>

            <p className="text-muted-foreground px-8 text-center text-sm">
              Уже есть аккаунт?{' '}
              <Link
                to="/auth/sign-in"
                search={{ redirect: undefined }}
                className="hover:text-primary font-medium underline underline-offset-4"
              >
                Войти
              </Link>
            </p>

            <p className="text-muted-foreground px-8 text-center text-sm">
              Активируя аккаунт, вы соглашаетесь с{' '}
              <a
                href="/terms"
                className="hover:text-primary underline underline-offset-4"
              >
                Условиями использования
              </a>{' '}
              и{' '}
              <a
                href="/privacy"
                className="hover:text-primary underline underline-offset-4"
              >
                Политикой конфиденциальности
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
