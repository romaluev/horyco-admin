import { useEffect, useState } from 'react'

import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'

import Cookies from 'js-cookie'

import {
  getAccessToken,
  getOnboardingProgress,
  getRouteForStep,
} from '@/shared/lib/auth-guard'
import { SidebarInset, SidebarProvider } from '@/shared/ui/base/sidebar'
import KBar from '@/shared/ui/kbar'
import AppSidebar from '@/shared/ui/layout/app-sidebar'
import Header from '@/shared/ui/layout/header'

import { OnboardingReminderDialog } from '@/widgets/onboarding-reminder-dialog'

export const Route = createFileRoute('/dashboard/_layout')({
  beforeLoad: ({ location }) => {
    const token = getAccessToken()

    // Redirect to login if not authenticated (synchronous check)
    if (!token) {
      throw redirect({
        to: '/auth/sign-in',
        search: { redirect: location.pathname },
      })
    }

    // Return token for component to use
    return { token }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { token } = Route.useRouteContext()
  const navigate = useNavigate()
  const [onboardingChecked, setOnboardingChecked] = useState(false)

  // Check onboarding status asynchronously (non-blocking)
  useEffect(() => {
    let mounted = true

    const checkOnboarding = async () => {
      if (!token) return

      const progress = await getOnboardingProgress(token)
      if (!mounted) return

      if (progress && !progress.isCompleted) {
        const onboardingRoute = getRouteForStep(progress.currentStep)
        navigate({ to: onboardingRoute as '/' })
      } else {
        setOnboardingChecked(true)
      }
    }

    checkOnboarding()

    return () => {
      mounted = false
    }
  }, [token, navigate])

  // Get sidebar state from cookie
  const isDefaultOpen = Cookies.get('sidebar_state') === 'true'

  return (
    <KBar>
      <SidebarProvider defaultOpen={isDefaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {onboardingChecked && <OnboardingReminderDialog />}
          <div className="relative min-h-0 flex-1">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  )
}
