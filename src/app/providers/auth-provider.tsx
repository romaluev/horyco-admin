'use client';

import { ReactNode, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/auth';
import { BaseLoading } from '@/shared/ui';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, me, isLoading, user, error } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    me();
  }, [me]);

  useEffect(() => {
    if (isLoading) return;

    const redirectPath = searchParams?.get('redirect');

    if (
      !user &&
      redirectPath &&
      redirectPath.startsWith('/') &&
      !redirectPath.startsWith('//') &&
      !redirectPath.includes(':')
    ) {
      router.push(redirectPath);
    }
  }, [user, isLoading, router, searchParams, setUser]);

  if (isLoading) {
    return <BaseLoading className='min-h-screen items-center' />;
  }
  if (error) {
    return <div>Что-то пошло не так, попробуйте перезагрузить страницу</div>;
  }
  return <>{children}</>;
}
