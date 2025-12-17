import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard']

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/register',
  '/auth/forgot-password',
  '/invite', // Magic link invitation for owners
  '/staff-invite', // Magic link invitation for employees
]

// Define onboarding routes (require auth but not full onboarding completion)
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

interface OnboardingProgress {
  currentStep: string
  isCompleted: boolean
}

// Fetch onboarding progress from API
async function getOnboardingProgress(
  token: string
): Promise<OnboardingProgress | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return null

    const response = await fetch(`${apiUrl}/admin/onboarding/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) return null

    const result = await response.json()
    return result.data as OnboardingProgress
  } catch {
    return null
  }
}

// Get the route for the current onboarding step
function getRouteForStep(step: string): string {
  return STEP_ROUTES[step] || '/onboarding/business-info'
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Get the token from cookies
  const token = req.cookies.get('access_token')?.value
  const isAuthenticated = !!token

  // Check if the current route is protected, public, or onboarding
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isOnboardingRoute = ONBOARDING_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // Redirect to login if accessing protected route without auth
  if (!isAuthenticated && (isProtectedRoute || isOnboardingRoute)) {
    const url = new URL('/auth/sign-in', req.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users from auth pages to dashboard (or onboarding)
  if (isAuthenticated && pathname.startsWith('/auth/sign-in')) {
    // Check onboarding status before redirecting
    const progress = await getOnboardingProgress(token)
    if (progress && !progress.isCompleted) {
      const onboardingRoute = getRouteForStep(progress.currentStep)
      return NextResponse.redirect(new URL(onboardingRoute, req.url))
    }
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Check onboarding completion when accessing protected routes
  if (isAuthenticated && isProtectedRoute) {
    const progress = await getOnboardingProgress(token)
    if (progress && !progress.isCompleted) {
      const onboardingRoute = getRouteForStep(progress.currentStep)
      return NextResponse.redirect(new URL(onboardingRoute, req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
