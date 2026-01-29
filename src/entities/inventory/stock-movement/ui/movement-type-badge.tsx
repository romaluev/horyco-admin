'use client'

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  RotateCcw,
  Package,
  Trash2,
  ClipboardCheck,
  Settings,
  ChefHat,
} from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import {
  MOVEMENT_TYPES,
  MOVEMENT_TYPE_LABELS,
  type MovementType,
} from '@/shared/types/inventory'
import { Badge } from '@/shared/ui/base/badge'

interface IMovementTypeBadgeProps {
  type: MovementType
  className?: string
  showIcon?: boolean
}

const typeConfig: Record<
  MovementType,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    icon: typeof ArrowDownToLine
    colorClass: string
  }
> = {
  [MOVEMENT_TYPES.PURCHASE_RECEIVE]: {
    variant: 'default',
    icon: ArrowDownToLine,
    colorClass: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  [MOVEMENT_TYPES.SALE_DEDUCTION]: {
    variant: 'secondary',
    icon: ArrowUpFromLine,
    colorClass: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  [MOVEMENT_TYPES.SALE_REVERSAL]: {
    variant: 'secondary',
    icon: RotateCcw,
    colorClass: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  },
  [MOVEMENT_TYPES.TRANSFER_IN]: {
    variant: 'outline',
    icon: ArrowLeftRight,
    colorClass: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  [MOVEMENT_TYPES.TRANSFER_OUT]: {
    variant: 'outline',
    icon: ArrowLeftRight,
    colorClass: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  [MOVEMENT_TYPES.WRITEOFF]: {
    variant: 'destructive',
    icon: Trash2,
    colorClass: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  [MOVEMENT_TYPES.COUNT_ADJUSTMENT]: {
    variant: 'outline',
    icon: ClipboardCheck,
    colorClass: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
  [MOVEMENT_TYPES.PRODUCTION_OUT]: {
    variant: 'secondary',
    icon: Package,
    colorClass: 'bg-teal-100 text-teal-800 hover:bg-teal-100',
  },
  [MOVEMENT_TYPES.PRODUCTION_IN]: {
    variant: 'default',
    icon: ChefHat,
    colorClass: 'bg-teal-100 text-teal-800 hover:bg-teal-100',
  },
  [MOVEMENT_TYPES.PRODUCTION_REVERSAL]: {
    variant: 'secondary',
    icon: RotateCcw,
    colorClass: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  },
  [MOVEMENT_TYPES.MANUAL_ADJUSTMENT]: {
    variant: 'outline',
    icon: Settings,
    colorClass: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  [MOVEMENT_TYPES.OPENING_BALANCE]: {
    variant: 'outline',
    icon: Package,
    colorClass: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
  },
}

export function MovementTypeBadge({
  type,
  className,
  showIcon = true,
}: IMovementTypeBadgeProps) {
  const config = typeConfig[type] || {
    variant: 'outline' as const,
    icon: Package,
    colorClass: '',
  }
  const Icon = config.icon
  const label = MOVEMENT_TYPE_LABELS[type] || type

  return (
    <Badge variant="outline" className={cn('gap-1', config.colorClass, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      <span>{label}</span>
    </Badge>
  )
}
