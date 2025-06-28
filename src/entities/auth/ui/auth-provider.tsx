'use client';

import { ReactNode, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/auth/model/store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    const redirectPath = searchParams?.get('redirect');

    if (
      isAuthenticated &&
      redirectPath &&
      redirectPath.startsWith('/') &&
      !redirectPath.startsWith('//') &&
      !redirectPath.includes(':')
    ) {
      console.log('login');
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  return <>{children}</>;
}
