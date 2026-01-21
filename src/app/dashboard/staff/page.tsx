import { useEffect } from 'react'

import { useRouter } from '@/shared/lib/navigation'

export default function StaffPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/staff/employees')
  }, [router])

  return null
}
