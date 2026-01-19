import Image from 'next/image'
import Link from 'next/link'

import logo from '@/shared/assets/logo.png'

import ForgotPasswordForm from '@/entities/auth/auth/ui/forgot-password-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Забыли пароль',
  description: 'Восстановление пароля',
}

export default function ForgotPasswordPage() {
  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr] items-center justify-center lg:max-w-none">
      <div className="flex items-center justify-center p-4 text-lg font-medium">
        <Image
          className="w-32 overflow-hidden"
          src={logo}
          alt=""
        />
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8 w-full">
        <div className="flex w-full flex-col items-center justify-center space-y-6">
          <ForgotPasswordForm />

          <p className="text-muted-foreground px-8 text-center text-sm">
            Вспомнили пароль?{' '}
            <Link
              href="/auth/sign-in"
              className="hover:text-primary font-medium underline underline-offset-4"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
