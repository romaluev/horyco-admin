'use client'

import { Link } from '@tanstack/react-router'

import { useTranslation } from 'react-i18next'

import logo from '@/shared/assets/logo.png'

import { RegistrationFlow } from '@/features/auth/auth'

export default function RegisterPage() {
  const { t } = useTranslation('auth')

  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr] items-center justify-center lg:max-w-none">
      <div className="flex items-center justify-center p-4 text-lg font-medium">
        <img className="w-32 overflow-hidden" src={logo} alt="Horyco Admin" />
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <RegistrationFlow />

          <p className="text-muted-foreground px-8 text-center text-sm">
            {t('register.initial.title')}{' '}
            <Link
              to="/auth/sign-in"
              search={{ redirect: undefined }}
              className="hover:text-primary underline underline-offset-4"
            >
              {t('signIn.title')}
            </Link>
          </p>

          <p className="text-muted-foreground px-8 text-center text-sm">
            {t('register.otp.successMessage')}{' '}
            <a
              href="#"
              className="hover:text-primary underline underline-offset-4"
            >
              Условиями использования
            </a>{' '}
            и{' '}
            <a
              href="#"
              className="hover:text-primary underline underline-offset-4"
            >
              Политикой конфиденциальности
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
