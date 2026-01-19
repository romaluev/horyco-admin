import { Suspense } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { Loader2 } from 'lucide-react'

import logo from '@/shared/assets/logo.png'

import StaffInviteForm from '@/entities/auth/auth/ui/staff-invite-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Активация аккаунта сотрудника',
  description: 'Активируйте ваш аккаунт сотрудника Horyco',
}

function StaffInviteFormFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
    </div>
  )
}

export default function StaffInvitePage() {
  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr] items-center justify-center lg:max-w-none">
      <div className="flex items-center justify-center p-4 text-lg font-medium">
        <Image
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
              href="/auth/sign-in"
              className="hover:text-primary font-medium underline underline-offset-4"
            >
              Войти
            </Link>
          </p>

          <p className="text-muted-foreground px-8 text-center text-sm">
            Активируя аккаунт, вы соглашаетесь с{' '}
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
