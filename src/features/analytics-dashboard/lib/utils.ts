/**
 * Analytics Dashboard Utility Functions
 */

import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { PaymentMethod, OrderStatus } from '@/entities/analytics'

/**
 * Format currency amount (Uzbekistan Som)
 * @param amount - Amount in som
 * @returns Formatted string with thousands separator
 */
export const formatCurrency = (amount: number): string => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Format percentage change with sign
 * @param value - Percentage value
 * @returns Formatted percentage with + or - sign
 */
export const formatPercentage = (value: number | null): string => {
  if (value === null) return 'N/A'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

/**
 * Get trend direction based on percentage change
 */
export const getTrendDirection = (
  value: number | null
): 'up' | 'down' | 'neutral' => {
  if (value === null || value === 0) return 'neutral'
  return value > 0 ? 'up' : 'down'
}

/**
 * Get trend color classes for Tailwind
 */
export const getTrendColorClass = (value: number | null): string => {
  const direction = getTrendDirection(value)
  if (direction === 'up') return 'text-green-600'
  if (direction === 'down') return 'text-red-600'
  return 'text-muted-foreground'
}

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'd MMM yyyy', { locale: ru })
}

/**
 * Format time for display (24-hour format)
 */
export const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'HH:mm')
}

/**
 * Get payment method display info
 */
export const getPaymentMethodInfo = (
  method: PaymentMethod
): { icon: string; label: string } => {
  const map: Record<PaymentMethod, { icon: string; label: string }> = {
    CASH: { icon: '💵', label: 'Cash' },
    CARD: { icon: '💳', label: 'Card' },
    CREDIT: { icon: '💳', label: 'Credit' },
    PAYME: { icon: '📱', label: 'Payme' },
    CLICK: { icon: '📱', label: 'Click' },
    UZUM: { icon: '💳', label: 'Uzum' },
    BANK_TRANSFER: { icon: '🏦', label: 'Bank' },
    MIXED: { icon: '🔀', label: 'Mixed' },
  }
  return map[method]
}

/**
 * Get order status display info
 */
export const getOrderStatusInfo = (
  status: OrderStatus
): { icon: string; label: string; colorClass: string } => {
  const map: Record<
    OrderStatus,
    { icon: string; label: string; colorClass: string }
  > = {
    PAID: { icon: '✓', label: 'Paid', colorClass: 'text-green-600' },
    PARTIALLY_PAID: {
      icon: '⏳',
      label: 'Partial',
      colorClass: 'text-orange-600',
    },
    NOT_PAID: { icon: '⏸️', label: 'Unpaid', colorClass: 'text-gray-600' },
  }
  return map[status]
}

/**
 * Format chart timestamp based on grouping
 */
export const formatChartLabel = (
  timestamp: string,
  groupBy: 'hour' | 'day' | 'week'
): string => {
  const date = parseISO(timestamp)

  if (groupBy === 'hour') {
    return format(date, 'HH:mm')
  }

  if (groupBy === 'day') {
    return format(date, 'd MMM', { locale: ru })
  }

  if (groupBy === 'week') {
    return format(date, "'Week' w", { locale: ru })
  }

  return timestamp
}
