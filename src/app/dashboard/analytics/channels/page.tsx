/**
 * Channels Analytics Page
 * Based on docs: 25-analytics-pages.md
 *
 * PRO tier - Requires analytics_pro or analytics_full entitlement
 * Shows sales by channel (dine-in, delivery, takeaway, etc.)
 */

'use client'

import * as React from 'react'

import {
  IconArrowDown,
  IconArrowUp,
  IconMinus,
  IconBuildingStore,
  IconMotorbike,
  IconShoppingBag,
  IconDevices,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'


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
  useChannelsAnalytics,
  AnalyticsPageLayout,
  AnalyticsErrorState,
} from '@/features/dashboard/analytics'

import type { IChannelItem } from '@/features/dashboard/analytics'

// ============================================
// CONSTANTS
// ============================================

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  DINE_IN: IconBuildingStore,
  DELIVERY: IconMotorbike,
  TAKEAWAY: IconShoppingBag,
  ONLINE: IconDevices,
}

// ============================================
// TYPES
// ============================================

type SortColumn = 'label' | 'orders' | 'revenue' | 'revenueShare' | 'avgCheck'
type SortDirection = 'asc' | 'desc'

// ============================================
// MAIN COMPONENT
// ============================================

export default function ChannelsAnalyticsPage() {
  const { t } = useTranslation('analytics')
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.THIS_WEEK)
  const [sortColumn, setSortColumn] = React.useState<SortColumn>('revenue')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')

  const { data, isLoading, error, refetch } = useChannelsAnalytics({
    period: { type: period },
  })

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export channels analytics')
  }

  // Sort channels
  const channels = data?.channels ?? []
  const sortedChannels = React.useMemo(() => {
    if (channels.length === 0) return []

    const sorted = [...channels]

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
  }, [channels, sortColumn, sortDirection])

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
      pageCode="channels"
      title={t('channels.title')}
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      {/* Content */}
      {isLoading ? (
        <ChannelsTableSkeleton />
      ) : error ? (
        <AnalyticsErrorState onRetry={() => refetch()} />
      ) : data ? (
        <>
          <ChannelsTable
            channels={sortedChannels}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          {/* Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            {t('channels.summary', {
              revenue: formatPrice(data.totalRevenue ?? 0),
              orders: (data.totalOrders ?? 0).toLocaleString('ru-RU'),
            })}
          </div>
        </>
      ) : null}
    </AnalyticsPageLayout>
  )
}

// ============================================
// CHANNELS TABLE
// ============================================

interface IChannelsTableProps {
  channels: IChannelItem[]
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}

function ChannelsTable({
  channels,
  sortColumn,
  sortDirection,
  onSort,
}: IChannelsTableProps) {
  const { t } = useTranslation('analytics')

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader
              column="label"
              label={t('channels.table.channel')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              column="orders"
              label={t('channels.table.orders')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="revenue"
              label={t('channels.table.revenue')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="revenueShare"
              label={t('channels.table.share')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="avgCheck"
              label={t('channels.table.avgCheck')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <TableHead className="text-right">{t('channels.table.change')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                {t('channels.table.noData')}
              </TableCell>
            </TableRow>
          ) : (
            channels.map((channel) => {
              const Icon = CHANNEL_ICONS[channel.channel] || IconBuildingStore

              return (
                <TableRow key={channel.channel}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <Icon className="size-4" />
                      </div>
                      <span className="font-medium">{channel.label ?? channel.channel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {(channel.orders ?? 0).toLocaleString('ru-RU')}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPrice(channel.revenue ?? 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ShareBar value={channel.revenueShare ?? 0} />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(channel.avgCheck ?? 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ChangeIndicator value={channel.ordersChange?.percent ?? 0} />
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
// CHANGE INDICATOR
// ============================================

interface IChangeIndicatorProps {
  value: number
}

function ChangeIndicator({ value }: IChangeIndicatorProps) {
  const isPositive = value > 0
  const isNegative = value < 0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        isPositive && 'text-green-600 dark:text-green-500',
        isNegative && 'text-red-600 dark:text-red-500',
        !isPositive && !isNegative && 'text-muted-foreground'
      )}
    >
      {isPositive && <IconArrowUp className="size-3" />}
      {isNegative && <IconArrowDown className="size-3" />}
      {!isPositive && !isNegative && <IconMinus className="size-3" />}
      {value > 0 ? '+' : ''}
      {value.toFixed(1)}%
    </span>
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

function ChannelsTableSkeleton() {
  const { t } = useTranslation('analytics')

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('channels.table.channel')}</TableHead>
            <TableHead className="text-right">{t('channels.table.orders')}</TableHead>
            <TableHead className="text-right">{t('channels.table.revenue')}</TableHead>
            <TableHead className="text-right">{t('channels.table.share')}</TableHead>
            <TableHead className="text-right">{t('channels.table.avgCheck')}</TableHead>
            <TableHead className="text-right">{t('channels.table.change')}</TableHead>
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
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-14" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
