import KBar from '@/shared/ui/kbar';
import AppSidebar from '@/shared/ui/layout/app-sidebar';
import Header from '@/shared/ui/layout/header';
import { SidebarInset, SidebarProvider } from '@/shared/ui/base/sidebar';
import { OnboardingReminderDialog } from '@/widgets/onboarding-reminder-dialog';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <OnboardingReminderDialog />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
