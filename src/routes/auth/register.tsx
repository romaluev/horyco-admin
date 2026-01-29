import { createFileRoute, Link } from '@tanstack/react-router'

import { Helmet } from 'react-helmet-async'

import logo from '@/shared/assets/logo.png'

import { RegistrationFlow } from '@/features/auth/auth'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>Регистрация | Horyco Admin</title>
        <meta
          name="description"
          content="Создайте аккаунт для вашего ресторана"
        />
      </Helmet>
      <div className="relative grid h-screen grid-rows-[auto_1fr] items-center justify-center lg:max-w-none">
        <div className="flex items-center justify-center p-4 text-lg font-medium">
          <img className="w-32 overflow-hidden" src={logo} alt="Horyco Admin" />
        </div>
        <div className="flex h-full items-center justify-center p-4 lg:p-8">
          <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
            <RegistrationFlow />

            <p className="text-muted-foreground px-8 text-center text-sm">
              Уже есть аккаунт?{' '}
              <Link
                to="/auth/sign-in"
                search={{ redirect: undefined }}
                className="hover:text-primary underline underline-offset-4"
              >
                Войти
              </Link>
            </p>

            <p className="text-muted-foreground px-8 text-center text-sm">
              Регистрируясь, вы соглашаетесь с{' '}
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
