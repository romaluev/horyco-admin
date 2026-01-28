/**
 * Auth Guard Utilities for TanStack Router
 */

import Cookies from 'js-cookie'

// ============================================================================
// Route Definitions
// ============================================================================

const PROTECTED_ROUTES = ['/dashboard']

const PUBLIC_ROUTES = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/register',
  '/auth/forgot-password',
  '/invite',
  '/staff-invite',
]

const ONBOARDING_ROUTES = [
  '/onboarding/business-info',
  '/onboarding/branch-setup',
  '/onboarding/menu-template',
  '/onboarding/staff-invite',
  '/onboarding/complete',
]

// Map onboarding step to route
const STEP_ROUTES: Record<string, string> = {
  registration_complete: '/onboarding/business-info',
  business_identity: '/onboarding/branch-setup',
  branch_setup: '/onboarding/menu-template',
  menu_template: '/onboarding/staff-invite',
  staff_invited: '/onboarding/complete',
  go_live: '/dashboard',
}

// ============================================================================
// Types
// ============================================================================

export interface OnboardingProgress {
  currentStep: string
  isCompleted: boolean
}

// ============================================================================
// Token Management
// ============================================================================

export function getAccessToken(): string | undefined {
  return Cookies.get('access_token')
}

export function isAuthenticated(): boolean {
  return !!getAccessToken()
}

// ============================================================================
// Onboarding Progress
// ============================================================================

export async function getOnboardingProgress(
  token: string
): Promise<OnboardingProgress | null> {
  try {
    const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
    if (!apiUrl) return null

    const response = await fetch(`${apiUrl}/admin/onboarding/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) return null

    const result = await response.json()
    return result.data as OnboardingProgress
  } catch {
    return null
  }
}

export function getRouteForStep(step: string): string {
  return STEP_ROUTES[step] || '/onboarding/business-info'
}

// ============================================================================
// Route Checks
// ============================================================================

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

export function isOnboardingRoute(pathname: string): boolean {
  return ONBOARDING_ROUTES.some((route) => pathname.startsWith(route))
}

export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth/')
}
