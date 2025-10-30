'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/entities/auth';
import Cookies from 'js-cookie';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { me } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      me();
    }
  }, [me]);

  return <>{children}</>;
}
