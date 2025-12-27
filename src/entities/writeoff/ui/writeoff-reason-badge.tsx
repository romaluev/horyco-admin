'use client'

import { Badge } from '@/shared/ui/base/badge'
import { WriteoffReason, WRITEOFF_REASON_LABELS } from '@/shared/types/inventory'
import { cn } from '@/shared/lib/utils'

interface WriteoffReasonBadgeProps {
  reason: WriteoffReason
  className?: string
}

const reasonStyles: Record<WriteoffReason, string> = {
  [WriteoffReason.SPOILAGE]: 'bg-orange-100 text-orange-800 border-orange-200',
  [WriteoffReason.THEFT]: 'bg-red-100 text-red-800 border-red-200',
  [WriteoffReason.DAMAGE]: 'bg-amber-100 text-amber-800 border-amber-200',
  [WriteoffReason.STAFF_MEAL]: 'bg-blue-100 text-blue-800 border-blue-200',
  [WriteoffReason.SAMPLE]: 'bg-purple-100 text-purple-800 border-purple-200',
  [WriteoffReason.EXPIRED]: 'bg-rose-100 text-rose-800 border-rose-200',
  [WriteoffReason.PRODUCTION]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [WriteoffReason.OTHER]: 'bg-gray-100 text-gray-800 border-gray-200',
}

export function WriteoffReasonBadge({
  reason,
  className,
}: WriteoffReasonBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-normal', reasonStyles[reason], className)}
    >
      {WRITEOFF_REASON_LABELS[reason]}
    </Badge>
  )
}
