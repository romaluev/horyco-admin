import { Toaster } from '@/shared/ui/base/sonner';
import ReactQueryProvider from './react-query-provider';
import { AuthProvider } from './auth-provider';
import { Suspense } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <ReactQueryProvider>
        <Suspense fallback={null}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </ReactQueryProvider>
    </>
  );
}
