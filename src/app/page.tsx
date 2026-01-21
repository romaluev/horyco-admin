import { useEffect } from 'react'

import { useRouter } from '@/shared/lib/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/overview')
  }, [router])

  return null
}
