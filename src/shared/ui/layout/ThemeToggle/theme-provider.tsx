'use client'

import * as React from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export default function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    const stored = localStorage.getItem(storageKey) as Theme | null
    return stored || defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>(
    () => {
      if (typeof window === 'undefined') return 'light'
      const stored = localStorage.getItem(storageKey) as Theme | null
      const currentTheme = stored || defaultTheme
      return currentTheme === 'system' ? getSystemTheme() : currentTheme
    }
  )

  const applyTheme = React.useCallback(
    (newTheme: Theme) => {
      const root = window.document.documentElement
      const resolved = newTheme === 'system' ? getSystemTheme() : newTheme

      if (disableTransitionOnChange) {
        root.style.setProperty('transition', 'none')
      }

      if (attribute === 'class') {
        root.classList.remove('light', 'dark')
        root.classList.add(resolved)
      } else {
        root.setAttribute(attribute, resolved)
      }

      if (disableTransitionOnChange) {
        // Force a reflow
        void root.offsetHeight
        root.style.removeProperty('transition')
      }

      setResolvedTheme(resolved)
    },
    [attribute, disableTransitionOnChange]
  )

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setThemeState(newTheme)
      applyTheme(newTheme)
    },
    [storageKey, applyTheme]
  )

  // Apply theme on mount
  React.useEffect(() => {
    applyTheme(theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for system theme changes
  React.useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, enableSystem, applyTheme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, setTheme, resolvedTheme]
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

export type { ThemeProviderProps }
