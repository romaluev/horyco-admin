import * as React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import logo from '@/shared/assets/logo.png'
import LogoIcon from '@/shared/ui/base/LogoIcon'

import LoginForm from './login-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

export default function SignInViewPage() {
  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr] items-center justify-center lg:max-w-none">
      <div className="flex items-center justify-center p-4 text-lg font-medium">
        <Image
          className="mr-1 !h-10 !w-10 overflow-hidden rounded-2xl"
          src={logo}
          alt=""
        />
        <h1 className="py-4 text-2xl font-semibold text-[#023055]">Horyco Admin</h1>
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <LoginForm />

          <p className="text-muted-foreground px-8 text-center text-sm">
            Нет аккаунта?{' '}
            <Link
              href="/auth/register"
              className="hover:text-primary font-medium underline underline-offset-4"
            >
              Зарегистрироваться
            </Link>
          </p>

          <p className="text-muted-foreground px-8 text-center text-sm">
            Входя в аккаунт, вы соглашаетесь с{' '}
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
