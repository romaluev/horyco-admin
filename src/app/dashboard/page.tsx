import { useEffect } from 'react'

import Cookies from 'js-cookie'

import { useRouter } from '@/shared/lib/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated by looking for the access_token cookie
    const token = Cookies.get('access_token')
    const isAuthenticated = !!token

    if (!isAuthenticated) {
      router.replace('/auth/sign-in')
    } else {
      router.replace('/dashboard/overview')
    }
  }, [router])

  return null
}
