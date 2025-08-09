'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/auth';
import { BaseLoading } from '@/shared/ui';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, me, isLoading, user, error } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const getMe = async () => {
    try {
      console.log(true);
      setLoading(true);
      await me();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

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

  if (loading) {
    return <BaseLoading className='min-h-screen items-center' />;
  }
  if (error) {
    return <div>Что-то пошло не так, попробуйте перезагрузить страницу</div>;
  }
  return <>{children}</>;
}
