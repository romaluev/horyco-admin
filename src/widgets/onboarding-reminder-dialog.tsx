'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { AlertCircle, X } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'

import { useGetOnboardingProgress } from '@/entities/onboarding'


// LocalStorage keys
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed'
const ONBOARDING_DISMISSED_KEY = 'onboarding_dismissed'

// LocalStorage utilities
const getOnboardingCompletedFromStorage = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true'
}

const setOnboardingCompletedToStorage = (completed: boolean): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(ONBOARDING_COMPLETED_KEY, String(completed))
}

const getOnboardingDismissedFromStorage = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ONBOARDING_DISMISSED_KEY) === 'true'
}

const setOnboardingDismissedToStorage = (dismissed: boolean): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(ONBOARDING_DISMISSED_KEY, String(dismissed))
}

export const OnboardingReminderDialog = (): JSX.Element | null => {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [shouldCheckApi, setShouldCheckApi] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const isCompleted = getOnboardingCompletedFromStorage()
    const isDismissed = getOnboardingDismissedFromStorage()

    // If completed or dismissed, don't show and don't check API
    if (isCompleted || isDismissed) {
      setShouldCheckApi(false)
      return
    }

    // If not cached, check API once
    setShouldCheckApi(true)
  }, [])

  // Only fetch if not cached
  const { data: progress, isLoading } = useGetOnboardingProgress({
    enabled: shouldCheckApi,
  })

  // Handle API response
  useEffect(() => {
    if (!shouldCheckApi || isLoading) return

    if (progress) {
      if (progress.isCompleted) {
        // Save to localStorage and hide
        setOnboardingCompletedToStorage(true)
        setIsVisible(false)
        setShouldCheckApi(false)
      } else {
        // Show dialog if not completed
        setIsVisible(true)
      }
    }
  }, [progress, isLoading, shouldCheckApi])

  const handleStartOnboarding = (): void => {
    setIsVisible(false)

    // Get the current step or start from beginning
    const route = progress?.currentStep
      ? getRouteForStep(progress.currentStep)
      : '/onboarding/business-info'

    router.push(route)
  }

  const handleDismiss = (): void => {
    setIsVisible(false)
    setOnboardingDismissedToStorage(true)
    setShouldCheckApi(false)
  }

  if (!isVisible) return null

  return (
    <div className="animate-in slide-in-from-right fixed top-20 right-4 z-50 w-80">
      <Card className="border-warning shadow-lg">
        <CardHeader className="relative pb-3">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-start gap-3">
            <AlertCircle className="text-warning mt-0.5 h-5 w-5" />
            <div>
              <CardTitle className="text-base">
                Настройка не завершена
              </CardTitle>
              <CardDescription className="mt-1">
                Завершите настройку для полного доступа к системе
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">
            Вы пропустили шаги настройки. Завершите их для активации всех
            функций системы.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleStartOnboarding}
              size="sm"
              className="flex-1"
            >
              Продолжить настройку
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="flex-1"
            >
              Позже
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to map step to route
const getRouteForStep = (step: string): string => {
  const stepRoutes: Record<string, string> = {
    REGISTRATION_COMPLETE: '/onboarding/business-info',
    BUSINESS_INFO_VERIFIED: '/onboarding/branch-setup',
    BRANCH_SETUP: '/onboarding/menu-template',
    MENU_TEMPLATE: '/onboarding/staff-invite',
    STAFF_INVITED: '/onboarding/complete',
    GO_LIVE: '/dashboard',
  }

  return stepRoutes[step] || '/onboarding/business-info'
}
