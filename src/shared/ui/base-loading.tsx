import { Loader2 } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

const BaseLoading = ({ className = '' }) => {
  return (
    <div className={cn('flex justify-center py-14', className)}>
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
    </div>
  )
}

export default BaseLoading
