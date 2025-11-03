'use client'

import { useEffect } from 'react'

import Cookies from 'js-cookie'

import { useAuthStore } from '@/entities/auth'

import type { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { me } = useAuthStore()

  useEffect(() => {
    const token = Cookies.get('access_token')
    if (token) {
      me()
    }
  }, [me])

  return children
}
