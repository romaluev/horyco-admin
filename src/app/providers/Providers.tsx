import React from 'react';
import { AuthProvider } from '@/entities/auth/ui/auth-provider';
import ReactQueryProvider from '@/app/providers/ReactQueryProvider';
import { ActiveThemeProvider } from '@/shared/ui/active-theme';
import { Toaster } from '@/shared/ui/base/sonner';
import I18NProvider from '@/app/providers/I18nProvider';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster />
      <I18NProvider>
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          <ReactQueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </ReactQueryProvider>
        </ActiveThemeProvider>
      </I18NProvider>
    </>
  );
}
