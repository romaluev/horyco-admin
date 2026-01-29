/**
 * Categories Analytics Page
 * Based on docs: 25-analytics-pages.md
 *
 * BASIC tier - Available to all plans
 * Shows category performance breakdown
 */

'use client'

import * as React from 'react'

import {
  IconArrowDown,
  IconArrowUp,
  IconMinus,
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
  useCategoryAnalytics,
  AnalyticsPageLayout,
  AnalyticsErrorState,
} from '@/features/dashboard/analytics'

import type { ICategoryAnalyticsItem } from '@/features/dashboard/analytics'

// ============================================
// TYPES
// ============================================

type SortColumn = 'name' | 'productCount' | 'orders' | 'revenue' | 'revenueShare'
type SortDirection = 'asc' | 'desc'

// ============================================
// MAIN COMPONENT
// ============================================

export default function CategoriesAnalyticsPage() {
  const { t } = useTranslation('analytics')
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.THIS_WEEK)
  const [sortColumn, setSortColumn] = React.useState<SortColumn>('revenue')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')

  const { data, isLoading, error, refetch } = useCategoryAnalytics({
    period: { type: period },
  })

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export categories analytics')
  }

  // Extract categories with defensive check
  const categories = data?.categories ?? []

  // Sort categories
  const sortedCategories = React.useMemo(() => {
    if (categories.length === 0) return []

    const sorted = [...categories]

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
  }, [categories, sortColumn, sortDirection])

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
      pageCode="categories"
      title={t('categories.title')}
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      {/* Content */}
      {isLoading ? (
        <CategoriesTableSkeleton />
      ) : error ? (
        <AnalyticsErrorState onRetry={() => refetch()} />
      ) : data ? (
        <CategoriesTable
          categories={sortedCategories}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      ) : null}

      {/* Summary */}
      {data && (
        <div className="mt-4 text-sm text-muted-foreground">
          {t('categories.summary', {
            count: data.summary?.totalCategories ?? categories.length,
            revenue: formatPrice(data.summary?.totalRevenue ?? 0),
          })}
        </div>
      )}
    </AnalyticsPageLayout>
  )
}

// ============================================
// CATEGORIES TABLE
// ============================================

interface ICategoriesTableProps {
  categories: ICategoryAnalyticsItem[]
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}

function CategoriesTable({
  categories,
  sortColumn,
  sortDirection,
  onSort,
}: ICategoriesTableProps) {
  const { t } = useTranslation('analytics')

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <SortableHeader
              column="name"
              label={t('categories.table.category')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              column="productCount"
              label={t('categories.table.productCount')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="orders"
              label={t('categories.table.orders')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="revenue"
              label={t('categories.table.revenue')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="revenueShare"
              label={t('categories.table.share')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <TableHead className="text-right">{t('categories.table.change')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                {t('categories.table.noData')}
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category, index) => (
              <TableRow key={category.categoryId ?? index} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium">{category.name ?? 'N/A'}</TableCell>
                <TableCell className="text-right">
                  {(category.productCount ?? 0).toLocaleString('ru-RU')}
                </TableCell>
                <TableCell className="text-right">
                  {(category.orders ?? 0).toLocaleString('ru-RU')}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(category.revenue ?? 0)}
                </TableCell>
                <TableCell className="text-right">{category.revenueShare ?? 0}%</TableCell>
                <TableCell className="text-right">
                  <ChangeIndicator value={category.revenueChange?.percent ?? 0} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
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
// SKELETON
// ============================================

function CategoriesTableSkeleton() {
  const { t } = useTranslation('analytics')

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead>{t('categories.table.category')}</TableHead>
            <TableHead className="text-right">{t('categories.table.productCount')}</TableHead>
            <TableHead className="text-right">{t('categories.table.orders')}</TableHead>
            <TableHead className="text-right">{t('categories.table.revenue')}</TableHead>
            <TableHead className="text-right">{t('categories.table.share')}</TableHead>
            <TableHead className="text-right">{t('categories.table.change')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-10" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-10" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-10" />
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
