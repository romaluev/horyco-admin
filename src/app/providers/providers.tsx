import React from 'react';
import { Toaster } from '@/shared/ui/base/sonner';
import ReactQueryProvider from './react-query-provider';
import { AuthProvider } from './auth-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <ReactQueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </ReactQueryProvider>
    </>
  );
}
