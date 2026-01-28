'use client'

import { Suspense } from 'react'

import logo from '@/shared/assets/logo.png'
import { BaseLoading } from '@/shared/ui'

import ResetPasswordForm from '@/entities/auth/auth/ui/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <div className="relative grid h-screen grid-rows-[auto_1fr] items-center justify-center lg:max-w-none">
      <div className="flex items-center justify-center p-4 text-lg font-medium">
        <img
          className="w-32 overflow-hidden"
          src={logo}
          alt=""
        />
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <Suspense fallback={<BaseLoading />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
