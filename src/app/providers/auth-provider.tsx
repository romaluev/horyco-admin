'use client'

import { useEffect } from 'react'

import Cookies from 'js-cookie'

import { useAuthStore } from '@/entities/auth'

import type { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { me, loadFullProfile } = useAuthStore()

  useEffect(() => {
    const token = Cookies.get('access_token')
    if (token) {
      me().catch((e: unknown) => console.error('Failed to load auth:', e))
      // Load full profile with avatar on app startup (non-blocking)
      void loadFullProfile().catch((e: unknown) => console.warn('Failed to load profile:', e))
    }
  }, [me, loadFullProfile])

  return children
}
