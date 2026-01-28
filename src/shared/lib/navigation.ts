/**
 * Navigation utilities for TanStack Router
 *
 * This module provides convenience hooks for common navigation patterns.
 */

import { useNavigate as useTanStackNavigate, useLocation, useSearch, useParams as useTanStackParams } from '@tanstack/react-router'

/**
 * Router hook for navigation
 *
 * Usage:
 * const router = useRouter()
 * router.push('/path')
 * router.back()
 */
export function useRouter() {
  const navigate = useTanStackNavigate()
  const location = useLocation()

  return {
    push: (path: string, _options?: { scroll?: boolean }) => navigate({ to: path as any }),
    replace: (path: string, _options?: { scroll?: boolean }) => navigate({ to: path as any, replace: true }),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => window.location.reload(),
    pathname: location.pathname,
    query: location.search as Record<string, string>,
  }
}

/**
 * Hook to get the current pathname
 */
export function usePathname() {
  const location = useLocation()
  return location.pathname
}

/**
 * Hook to access URL search params
 * Note: Returns a simplified interface
 */
export function useSearchParams() {
  const search = useSearch({ strict: false }) as Record<string, unknown>

  // Create a URLSearchParams-like interface
  return {
    get: (key: string) => {
      const value = search[key]
      return value !== undefined ? String(value) : null
    },
    getAll: (key: string) => {
      const value = search[key]
      if (Array.isArray(value)) return value.map(String)
      if (value !== undefined) return [String(value)]
      return []
    },
    has: (key: string) => key in search,
    entries: () => Object.entries(search).map(([k, v]) => [k, String(v)] as [string, string]),
    keys: () => Object.keys(search),
    values: () => Object.values(search).map(v => String(v)),
    toString: () => new URLSearchParams(search as Record<string, string>).toString(),
  }
}

/**
 * Hook to access route params
 * Note: Params come from the TanStack Router context
 */
export function useParams(): Record<string, string> {
  const params = useTanStackParams({ strict: false })
  return params as Record<string, string>
}

/**
 * Redirect function for TanStack Router
 * Note: Use in beforeLoad or loader, not in components
 */
export { redirect } from '@tanstack/react-router'
