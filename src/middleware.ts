import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/register',
  '/auth/forgot-password'
];

// Define onboarding routes (require auth but not full onboarding completion)
const ONBOARDING_ROUTES = [
  '/onboarding/business-info',
  '/onboarding/branch-setup',
  '/onboarding/menu-template',
  '/onboarding/payment-setup',
  '/onboarding/staff-invite',
  '/onboarding/complete'
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get the token from cookies
  const token = req.cookies.get('access_token')?.value;
  const isAuthenticated = !!token;

  // Check if the current route is protected, public, or onboarding
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isOnboardingRoute = ONBOARDING_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without auth
  if (!isAuthenticated && (isProtectedRoute || isOnboardingRoute)) {
    const url = new URL('/auth/sign-in', req.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from auth pages to dashboard
  // (except registration which might redirect to onboarding)
  if (isAuthenticated && pathname.startsWith('/auth/sign-in')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Note: Onboarding completion check and redirects are handled client-side
  // in the AuthProvider based on the user's onboarding progress from the API

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
