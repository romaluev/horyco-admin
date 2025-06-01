import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard'];

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password'
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get the token from cookies
  const token = req.cookies.get('access_token')?.value;
  const isAuthenticated = !!token;
  // Check if the current route is protected or public
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Case 1: Unauthenticated user trying to access protected route - redirect to login
  if (!isAuthenticated && isProtectedRoute) {
    const url = new URL('/auth/sign-in', req.url);

    // Only set redirect for valid internal paths
    if (
      pathname.startsWith('/') &&
      !pathname.startsWith('//') &&
      !pathname.includes(':')
    ) {
      url.searchParams.set('redirect', pathname);
    }

    return NextResponse.redirect(url);
  }

  // Case 2: Authenticated user trying to access auth pages - redirect to dashboard
  if (isAuthenticated && isPublicRoute) {
    const url = new URL('/dashboard', req.url);
    return NextResponse.redirect(url);
  }

  // For all other cases, proceed normally
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
