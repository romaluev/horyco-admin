import React, { Suspense } from 'react'

import { BaseLoading } from '@/shared/ui'
import { Toaster } from '@/shared/ui/base/sonner'

import { AuthProvider } from './auth-provider'
import { KBar } from './kbar-provider'
import ReactQueryProvider from './react-query-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <ReactQueryProvider>
        <KBar>
          <Suspense fallback={<BaseLoading />}>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </KBar>
      </ReactQueryProvider>
    </>
  )
}
