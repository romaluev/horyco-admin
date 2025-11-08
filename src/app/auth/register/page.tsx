import Image from 'next/image'
import Link from 'next/link'

import logo from '@/shared/assets/logo.png'

import { RegistrationFlow } from '@/features/auth'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Регистрация',
  description: 'Создайте аккаунт для вашего ресторана',
}

export default function RegisterPage() {
  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr] items-center justify-center lg:max-w-none">
      <div className="flex items-center justify-center p-4 text-lg font-medium">
        <Image
          className="mr-1 !h-10 !w-10 overflow-hidden rounded-2xl"
          src={logo}
          alt="Horyco Admin"
        />
        <h1 className="py-4 text-2xl font-semibold text-[#023055]">Horyco Admin</h1>
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <RegistrationFlow />

          <p className="text-muted-foreground px-8 text-center text-sm">
            Уже есть аккаунт?{' '}
            <Link
              href="/auth/sign-in"
              className="hover:text-primary underline underline-offset-4"
            >
              Войти
            </Link>
          </p>

          <p className="text-muted-foreground px-8 text-center text-sm">
            Регистрируясь, вы соглашаетесь с{' '}
            <Link
              href="/terms"
              className="hover:text-primary underline underline-offset-4"
            >
              Условиями использования
            </Link>{' '}
            и{' '}
            <Link
              href="/privacy"
              className="hover:text-primary underline underline-offset-4"
            >
              Политикой конфиденциальности
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
