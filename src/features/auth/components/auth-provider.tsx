'use client';

import { ReactNode, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth-store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle redirect after successful login
  useEffect(() => {
    // Skip during initial loading
    if (isLoading) return;

    // If user is authenticated and there's a redirect parameter, navigate to that URL
    const redirectPath = searchParams?.get('redirect');

    // Validate the redirect path to prevent open redirect vulnerabilities
    // Only allow redirects to relative paths within our application
    if (
      isAuthenticated &&
      redirectPath &&
      redirectPath.startsWith('/') &&
      !redirectPath.startsWith('//') &&
      !redirectPath.includes(':')
    ) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  return <>{children}</>;
}
