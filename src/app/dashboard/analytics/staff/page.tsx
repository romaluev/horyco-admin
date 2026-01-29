/**
 * Staff Analytics Page
 * Based on docs: 25-analytics-pages.md - Part 4: Staff Analytics
 *
 * PRO tier - Requires analytics_pro or analytics_full entitlement
 * Shows staff performance breakdown
 */

'use client'

import * as React from 'react'

import {
  IconArrowDown,
  IconArrowUp,
  IconMinus,
  IconSearch,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'


import { PeriodType } from '@/shared/api/graphql'
import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/ui/base/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
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
  useStaffAnalytics,
  AnalyticsPageLayout,
  AnalyticsErrorState,
} from '@/features/dashboard/analytics'

import type { IStaffAnalyticsItem } from '@/features/dashboard/analytics'

// ============================================
// TYPES
// ============================================

type SortColumn = 'name' | 'roleCode' | 'orders' | 'revenue' | 'tips' | 'avgCheck'
type SortDirection = 'asc' | 'desc'

// ============================================
// MAIN COMPONENT
// ============================================

export default function StaffAnalyticsPage() {
  const { t } = useTranslation('analytics')
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.THIS_WEEK)
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<string>('all')
  const [sortColumn, setSortColumn] = React.useState<SortColumn>('revenue')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')

  const { data, isLoading, error, refetch } = useStaffAnalytics({
    period: { type: period },
  })

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export staff analytics')
  }

  // Extract staff array with defensive check
  const staffList = data?.staff ?? []

  // Get unique roles for filter
  const roles = React.useMemo(() => {
    if (staffList.length === 0) return []
    const uniqueRoles = [...new Set(staffList.map((s) => s.roleCode).filter(Boolean))]
    return uniqueRoles.sort()
  }, [staffList])

  // Filter and sort staff
  const filteredStaff = React.useMemo(() => {
    if (staffList.length === 0) return []

    let filtered = [...staffList]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((s) => (s.name ?? '').toLowerCase().includes(searchLower))
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((s) => s.roleCode === roleFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
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

    return filtered
  }, [staffList, search, roleFilter, sortColumn, sortDirection])

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
      pageCode="staff"
      title={t('staff.title')}
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('staff.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('staff.allRoles')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('staff.allRoles')}</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <StaffTableSkeleton />
      ) : error ? (
        <AnalyticsErrorState onRetry={() => refetch()} />
      ) : data ? (
        <StaffTable
          staff={filteredStaff}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      ) : null}

      {/* Summary */}
      {data && (
        <div className="mt-4 text-sm text-muted-foreground">
          {t('staff.summary', { count: filteredStaff.length })}
        </div>
      )}
    </AnalyticsPageLayout>
  )
}

// ============================================
// STAFF TABLE
// ============================================

interface IStaffTableProps {
  staff: IStaffAnalyticsItem[]
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}

function StaffTable({
  staff,
  sortColumn,
  sortDirection,
  onSort,
}: IStaffTableProps) {
  const { t } = useTranslation('analytics')

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <SortableHeader
              column="name"
              label={t('staff.table.employee')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              column="roleCode"
              label={t('staff.table.role')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              column="orders"
              label={t('staff.table.orders')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="revenue"
              label={t('staff.table.revenue')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="tips"
              label={t('staff.table.tips')}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <TableHead className="text-right">{t('staff.table.change')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                {t('staff.table.noData')}
              </TableCell>
            </TableRow>
          ) : (
            staff.map((member, index) => (
              <TableRow key={member.employeeId ?? index} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium">{member.name ?? 'N/A'}</TableCell>
                <TableCell className="text-muted-foreground">{member.roleCode ?? '-'}</TableCell>
                <TableCell className="text-right">
                  {(member.orders ?? 0).toLocaleString('ru-RU')}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(member.revenue ?? 0)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(member.tips ?? 0)}
                </TableCell>
                <TableCell className="text-right">
                  <ChangeIndicator value={member.revenueChange?.percent ?? 0} />
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

function StaffTableSkeleton() {
  const { t } = useTranslation('analytics')

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead>{t('staff.table.employee')}</TableHead>
            <TableHead>{t('staff.table.role')}</TableHead>
            <TableHead className="text-right">{t('staff.table.orders')}</TableHead>
            <TableHead className="text-right">{t('staff.table.revenue')}</TableHead>
            <TableHead className="text-right">{t('staff.table.tips')}</TableHead>
            <TableHead className="text-right">{t('staff.table.change')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
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
                <Skeleton className="ml-auto h-4 w-14" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
