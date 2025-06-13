'use client';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { AuthProvider } from '@/features/auth/components/auth-provider';
import ReactQueryProvider from '@/app/providers/ReactQueryProvider';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
      </ActiveThemeProvider>
    </>
  );
}
