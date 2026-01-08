'use client'

import { useEffect } from 'react'

import { getAccessToken } from '@/shared/lib/token-manager'
import { useAuthStore } from '@/entities/auth'

import type { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { me, loadFullProfile, setToken } = useAuthStore()

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      // Sync token from cookies to store
      setToken(token)
      me().catch((e: unknown) => console.error('Failed to load auth:', e))
      // Load full profile with avatar on app startup (non-blocking)
      void loadFullProfile().catch((e: unknown) => console.warn('Failed to load profile:', e))
    }
  }, [me, loadFullProfile, setToken])

  return children
}
