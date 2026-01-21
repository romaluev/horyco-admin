import { Suspense } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { HelmetProvider } from 'react-helmet-async'
import NProgress from 'nprogress'

import '@/shared/config/i18n'
import { BaseLoading } from '@/shared/ui'
import { ActiveThemeProvider } from '@/shared/ui/active-theme'
import { Toaster } from '@/shared/ui/base/sonner'
import ThemeProvider from '@/shared/ui/layout/ThemeToggle/theme-provider'

import { AuthProvider } from '@/app/providers/auth-provider'
import { KBar } from '@/app/providers/kbar-provider'

// Configure NProgress
NProgress.configure({ showSpinner: false })

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
})

export const Route = createRootRoute({
  component: RootLayout,
  pendingComponent: () => <BaseLoading />,
})

function RootLayout() {
  return (
    <HelmetProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ActiveThemeProvider>
          <Toaster />
          <QueryClientProvider client={queryClient}>
            <KBar>
              <Suspense fallback={<BaseLoading />}>
                <AuthProvider>
                  <Outlet />
                </AuthProvider>
              </Suspense>
            </KBar>
          </QueryClientProvider>
        </ActiveThemeProvider>
      </ThemeProvider>
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </HelmetProvider>
  )
}
