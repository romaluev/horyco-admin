'use client'

import { Badge } from '@/shared/ui/base/badge'
import { MovementType, MOVEMENT_TYPE_LABELS } from '@/shared/types/inventory'
import { cn } from '@/shared/lib/utils'

interface MovementTypeBadgeProps {
  type: MovementType
  className?: string
}

const typeStyles: Record<MovementType, string> = {
  [MovementType.PURCHASE_RECEIVE]: 'bg-green-100 text-green-800 border-green-200',
  [MovementType.SALE_DEDUCTION]: 'bg-blue-100 text-blue-800 border-blue-200',
  [MovementType.SALE_REVERSAL]: 'bg-purple-100 text-purple-800 border-purple-200',
  [MovementType.WRITEOFF]: 'bg-red-100 text-red-800 border-red-200',
  [MovementType.COUNT_ADJUSTMENT]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [MovementType.PRODUCTION_OUT]: 'bg-orange-100 text-orange-800 border-orange-200',
  [MovementType.PRODUCTION_IN]: 'bg-teal-100 text-teal-800 border-teal-200',
  [MovementType.MANUAL_ADJUSTMENT]: 'bg-gray-100 text-gray-800 border-gray-200',
  [MovementType.OPENING_BALANCE]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [MovementType.TRANSFER_OUT]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  [MovementType.TRANSFER_IN]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
}

export function MovementTypeBadge({ type, className }: MovementTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-normal', typeStyles[type], className)}
    >
      {MOVEMENT_TYPE_LABELS[type]}
    </Badge>
  )
}

interface MovementQuantityBadgeProps {
  quantity: number
  unit: string
  className?: string
}

export function MovementQuantityBadge({
  quantity,
  unit,
  className,
}: MovementQuantityBadgeProps) {
  const isPositive = quantity > 0
  const formattedQty = isPositive ? `+${quantity}` : quantity.toString()

  return (
    <span
      className={cn(
        'font-medium',
        isPositive ? 'text-green-600' : 'text-red-600',
        className
      )}
    >
      {formattedQty} {unit}
    </span>
  )
}
