import { cookies } from 'next/headers'

import { SidebarInset, SidebarProvider } from '@/shared/ui/base/sidebar'
import KBar from '@/shared/ui/kbar'
import AppSidebar from '@/shared/ui/layout/app-sidebar'
import Header from '@/shared/ui/layout/header'

import { OnboardingReminderDialog } from '@/widgets/onboarding-reminder-dialog'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies()
  const isDefaultOpen = cookieStore.get('sidebar_state')?.value === 'true'
  return (
    <KBar>
      <SidebarProvider defaultOpen={isDefaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <OnboardingReminderDialog />
          <div className="relative min-h-0 flex-1">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  )
}
