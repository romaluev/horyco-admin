import React, { Suspense } from 'react';
import { Toaster } from '@/shared/ui/base/sonner';
import ReactQueryProvider from './react-query-provider';
import { AuthProvider } from './auth-provider';
import { BaseLoading } from '@/shared/ui';
import { KBar } from './kbar-provider';

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
  );
}
