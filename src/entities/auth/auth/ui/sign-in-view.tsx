import * as React from 'react'

import { Link } from '@tanstack/react-router'

import logo from '@/shared/assets/logo.png'

import LoginForm from './login-form'

export default function SignInViewPage() {
  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr] items-center justify-center lg:max-w-none">
      <div className="flex items-center justify-center p-4 text-lg font-medium">
        <img className="w-32 overflow-hidden" src={logo} alt="" />
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <LoginForm />

          <p className="text-muted-foreground px-8 text-center text-sm">
            Нет аккаунта?{' '}
            <Link
              to="/auth/register"
              className="hover:text-primary font-medium underline underline-offset-4"
            >
              Зарегистрироваться
            </Link>
          </p>

          <p className="text-muted-foreground px-8 text-center text-sm">
            Входя в аккаунт, вы соглашаетесь с{' '}
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
