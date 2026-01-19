/**
 * Payments Analytics Page
 * Based on docs: 25-analytics-pages.md - Part 3: Payments Analytics
 *
 * BASIC tier - Available to all plans
 * Shows payment methods breakdown
 */

'use client'

import * as React from 'react'

import {
  IconArrowDown,
  IconArrowUp,
  IconCash,
  IconCreditCard,
  IconDeviceMobile,
  IconWallet,
} from '@tabler/icons-react'

import { PeriodType } from '@/shared/api/graphql'
import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import {
  usePaymentMethodsAnalytics,
  AnalyticsPageLayout,
  AnalyticsErrorState,
} from '@/features/dashboard/analytics'

import type { IPaymentMethodItem } from '@/features/dashboard/analytics'

// ============================================
// CONSTANTS
// ============================================

const PAYMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CASH: IconCash,
  CARD: IconCreditCard,
  PAYME: IconDeviceMobile,
  CLICK: IconDeviceMobile,
  UZUM: IconDeviceMobile,
  OTHER: IconWallet,
}

// ============================================
// TYPES
// ============================================

type SortColumn = 'label' | 'transactions' | 'amount' | 'share' | 'avgAmount'
type SortDirection = 'asc' | 'desc'

// ============================================
// MAIN COMPONENT
// ============================================

export default function PaymentsAnalyticsPage() {
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.THIS_WEEK)
  const [sortColumn, setSortColumn] = React.useState<SortColumn>('amount')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')

  const { data, isLoading, error, refetch } = usePaymentMethodsAnalytics({
    period: { type: period },
  })

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export payments analytics')
  }

  // Extract methods with defensive check
  const methods = data?.methods ?? []

  // Sort methods
  const sortedMethods = React.useMemo(() => {
    if (methods.length === 0) return []

    const sorted = [...methods]

    sorted.sort((a, b) => {
      let aValue: string | number = a[sortColumn] ?? 0
      let bValue: string | number = b[sortColumn] ?? 0

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [methods, sortColumn, sortDirection])

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  return (
    <AnalyticsPageLayout
      pageCode="payments"
      title="Способы оплаты"
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      {/* Content */}
      {isLoading ? (
        <PaymentsTableSkeleton />
      ) : error ? (
        <AnalyticsErrorState onRetry={() => refetch()} />
      ) : data ? (
        <>
          <PaymentsTable
            methods={sortedMethods}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          {/* Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Всего: {formatPrice(data.summary?.totalAmount ?? 0)} ({(data.summary?.totalTransactions ?? 0).toLocaleString('ru-RU')} транзакций)
            </span>
            {data.summary?.changes && <ChangeSummary changes={data.summary.changes} />}
          </div>
        </>
      ) : null}
    </AnalyticsPageLayout>
  )
}

// ============================================
// PAYMENTS TABLE
// ============================================

interface IPaymentsTableProps {
  methods: IPaymentMethodItem[]
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}

function PaymentsTable({
  methods,
  sortColumn,
  sortDirection,
  onSort,
}: IPaymentsTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader
              column="label"
              label="Способ оплаты"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              column="transactions"
              label="Транзакций"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="amount"
              label="Сумма"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="share"
              label="Доля"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="avgAmount"
              label="Средняя сумма"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {methods.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                Нет данных для отображения
              </TableCell>
            </TableRow>
          ) : (
            methods.map((method, index) => {
              const Icon = PAYMENT_ICONS[method.method] || IconWallet

              return (
                <TableRow key={method.method ?? index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <Icon className="size-4" />
                      </div>
                      <span className="font-medium">{method.label ?? method.method ?? 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {(method.transactions ?? 0).toLocaleString('ru-RU')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(method.amount ?? 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ShareBar value={method.share ?? 0} />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(method.avgAmount ?? 0)}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// ============================================
// SHARE BAR
// ============================================

interface IShareBarProps {
  value: number
}

function ShareBar({ value }: IShareBarProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-10 text-right">{value}%</span>
    </div>
  )
}

// ============================================
// CHANGE SUMMARY
// ============================================

interface IChangeSummaryProps {
  changes: {
    total: number
    cash: number
    card: number
    online: number
  }
}

function ChangeSummary({ changes }: IChangeSummaryProps) {
  return (
    <div className="flex items-center gap-4">
      <ChangeChip label="Всего" value={changes?.total ?? 0} />
      <ChangeChip label="Наличные" value={changes?.cash ?? 0} />
      <ChangeChip label="Карты" value={changes?.card ?? 0} />
      <ChangeChip label="Онлайн" value={changes?.online ?? 0} />
    </div>
  )
}

interface IChangeChipProps {
  label: string
  value: number
}

function ChangeChip({ label, value }: IChangeChipProps) {
  const isPositive = value > 0
  const isNegative = value < 0

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs">{label}:</span>
      <span
        className={cn(
          'inline-flex items-center gap-0.5 text-xs font-medium',
          isPositive && 'text-green-600 dark:text-green-500',
          isNegative && 'text-red-600 dark:text-red-500'
        )}
      >
        {isPositive && <IconArrowUp className="size-3" />}
        {isNegative && <IconArrowDown className="size-3" />}
        {value > 0 ? '+' : ''}
        {value.toFixed(1)}%
      </span>
    </div>
  )
}

// ============================================
// SORTABLE HEADER
// ============================================

interface ISortableHeaderProps {
  column: SortColumn
  label: string
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
  className?: string
}

function SortableHeader({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort,
  className,
}: ISortableHeaderProps) {
  const isActive = sortColumn === column

  return (
    <TableHead
      className={cn('cursor-pointer select-none hover:bg-muted/50', className)}
      onClick={() => onSort(column)}
    >
      <div className={cn('flex items-center gap-1', className?.includes('text-right') && 'justify-end')}>
        {label}
        {isActive && (
          sortDirection === 'asc' ? (
            <IconArrowUp className="size-3" />
          ) : (
            <IconArrowDown className="size-3" />
          )
        )}
      </div>
    </TableHead>
  )
}

// ============================================
// SKELETON
// ============================================

function PaymentsTableSkeleton() {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Способ оплаты</TableHead>
            <TableHead className="text-right">Транзакций</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
            <TableHead className="text-right">Доля</TableHead>
            <TableHead className="text-right">Средняя сумма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-lg" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-12" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-20" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
