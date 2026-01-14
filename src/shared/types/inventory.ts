/**
 * Inventory Management System - Shared Types
 * Module: addon_inventory
 */

// ============================================
// ENUMS
// ============================================

export const MOVEMENT_TYPES = {
  PURCHASE_RECEIVE: 'PURCHASE_RECEIVE',
  SALE_DEDUCTION: 'SALE_DEDUCTION',
  SALE_REVERSAL: 'SALE_REVERSAL',
  TRANSFER_OUT: 'TRANSFER_OUT',
  TRANSFER_IN: 'TRANSFER_IN',
  WRITEOFF: 'WRITEOFF',
  COUNT_ADJUSTMENT: 'COUNT_ADJUSTMENT',
  PRODUCTION_OUT: 'PRODUCTION_OUT',
  PRODUCTION_IN: 'PRODUCTION_IN',
  PRODUCTION_REVERSAL: 'PRODUCTION_REVERSAL',
  MANUAL_ADJUSTMENT: 'MANUAL_ADJUSTMENT',
  OPENING_BALANCE: 'OPENING_BALANCE',
} as const

export const PO_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  PARTIAL: 'partial',
  RECEIVED: 'received',
  CANCELLED: 'cancelled',
} as const

export const WRITEOFF_REASONS = {
  SPOILAGE: 'spoilage',
  THEFT: 'theft',
  DAMAGE: 'damage',
  STAFF_MEAL: 'staff_meal',
  SAMPLE: 'sample',
  EXPIRED: 'expired',
  PRODUCTION: 'production',
  OTHER: 'other',
} as const

export const COUNT_TYPES = {
  FULL: 'full',
  CYCLE: 'cycle',
  SPOT: 'spot',
} as const

export const COUNT_STATUSES = {
  IN_PROGRESS: 'in_progress',
  PENDING_APPROVAL: 'pending_approval',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const PRODUCTION_STATUSES = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const ALERT_TYPES = {
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  NEGATIVE_STOCK: 'NEGATIVE_STOCK',
  EXPIRING_SOON: 'EXPIRING_SOON',
} as const

// ============================================
// TYPE DEFINITIONS
// ============================================

export type MovementType = (typeof MOVEMENT_TYPES)[keyof typeof MOVEMENT_TYPES]
export type POStatus = (typeof PO_STATUSES)[keyof typeof PO_STATUSES]
export type WriteoffReason =
  (typeof WRITEOFF_REASONS)[keyof typeof WRITEOFF_REASONS]
export type CountType = (typeof COUNT_TYPES)[keyof typeof COUNT_TYPES]
export type CountStatus = (typeof COUNT_STATUSES)[keyof typeof COUNT_STATUSES]
export type ProductionStatus =
  (typeof PRODUCTION_STATUSES)[keyof typeof PRODUCTION_STATUSES]
export type AlertType = (typeof ALERT_TYPES)[keyof typeof ALERT_TYPES]

// ============================================
// LABEL MAPS (for UI display)
// ============================================

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  PURCHASE_RECEIVE: 'Приход по закупке',
  SALE_DEDUCTION: 'Списание по заказу',
  SALE_REVERSAL: 'Возврат по отмене',
  TRANSFER_OUT: 'Перемещение (исход)',
  TRANSFER_IN: 'Перемещение (приход)',
  WRITEOFF: 'Списание',
  COUNT_ADJUSTMENT: 'Корректировка',
  PRODUCTION_OUT: 'Производство (расход)',
  PRODUCTION_IN: 'Производство (выход)',
  PRODUCTION_REVERSAL: 'Отмена производства',
  MANUAL_ADJUSTMENT: 'Ручная корректировка',
  OPENING_BALANCE: 'Начальный остаток',
}

export const PO_STATUS_LABELS: Record<POStatus, string> = {
  draft: 'Черновик',
  sent: 'Отправлен',
  partial: 'Частично получен',
  received: 'Получен',
  cancelled: 'Отменён',
}

export const WRITEOFF_REASON_LABELS: Record<WriteoffReason, string> = {
  spoilage: 'Порча',
  theft: 'Кража',
  damage: 'Повреждение',
  staff_meal: 'Питание персонала',
  sample: 'Дегустация',
  expired: 'Истёк срок',
  production: 'Производство',
  other: 'Другое',
}

export const COUNT_TYPE_LABELS: Record<CountType, string> = {
  full: 'Полная',
  cycle: 'Циклическая',
  spot: 'Выборочная',
}

export const COUNT_STATUS_LABELS: Record<CountStatus, string> = {
  in_progress: 'В процессе',
  pending_approval: 'Ожидает одобрения',
  completed: 'Завершена',
  cancelled: 'Отменена',
}

export const PRODUCTION_STATUS_LABELS: Record<ProductionStatus, string> = {
  planned: 'Запланировано',
  in_progress: 'В процессе',
  completed: 'Завершено',
  cancelled: 'Отменено',
}

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  LOW_STOCK: 'Низкий остаток',
  OUT_OF_STOCK: 'Нет в наличии',
  NEGATIVE_STOCK: 'Отрицательный остаток',
  EXPIRING_SOON: 'Скоро истекает срок',
}

// ============================================
// COLOR MAPS (for status badges)
// ============================================

export const MOVEMENT_TYPE_COLORS: Record<
  MovementType,
  'default' | 'success' | 'warning' | 'destructive' | 'secondary'
> = {
  PURCHASE_RECEIVE: 'success',
  SALE_DEDUCTION: 'default',
  SALE_REVERSAL: 'secondary',
  TRANSFER_OUT: 'warning',
  TRANSFER_IN: 'warning',
  WRITEOFF: 'destructive',
  COUNT_ADJUSTMENT: 'secondary',
  PRODUCTION_OUT: 'default',
  PRODUCTION_IN: 'success',
  PRODUCTION_REVERSAL: 'secondary',
  MANUAL_ADJUSTMENT: 'secondary',
  OPENING_BALANCE: 'secondary',
}

export const PO_STATUS_COLORS: Record<
  POStatus,
  'default' | 'success' | 'warning' | 'destructive' | 'secondary'
> = {
  draft: 'secondary',
  sent: 'warning',
  partial: 'default',
  received: 'success',
  cancelled: 'destructive',
}

export const ALERT_TYPE_COLORS: Record<
  AlertType,
  'default' | 'success' | 'warning' | 'destructive' | 'secondary'
> = {
  LOW_STOCK: 'warning',
  OUT_OF_STOCK: 'destructive',
  NEGATIVE_STOCK: 'destructive',
  EXPIRING_SOON: 'warning',
}
