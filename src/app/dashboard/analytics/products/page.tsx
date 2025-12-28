/**
 * Products Analytics Page
 * Based on docs: 25-analytics-pages.md - Part 2: Products Analytics
 *
 * BASIC tier - Available to all plans
 * Shows product performance table with ABC classification
 */

'use client'

import * as React from 'react'

import {
  IconArrowDown,
  IconArrowUp,
  IconMinus,
  IconSearch,
} from '@tabler/icons-react'

import { PeriodType } from '@/shared/api/graphql'
import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/base/badge'
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
  useProductAnalytics,
  AnalyticsPageLayout,
  AnalyticsErrorState,
  ABC_CLASS_COLORS,
} from '@/features/analytics'

import type { IProductAnalyticsItem } from '@/features/analytics'

// ============================================
// TYPES
// ============================================

type SortColumn = 'name' | 'quantity' | 'revenue' | 'share' | 'abcClass'
type SortDirection = 'asc' | 'desc'

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProductsAnalyticsPage() {
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.THIS_WEEK)
  const [search, setSearch] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')
  const [sortColumn, setSortColumn] = React.useState<SortColumn>('revenue')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')

  const { data, isLoading, error, refetch } = useProductAnalytics({
    period: { type: period },
    limit: 100,
  })

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export products analytics')
  }

  // Extract products array with defensive check
  const products = data?.products ?? []

  // Get unique categories for filter
  const categories = React.useMemo(() => {
    if (products.length === 0) return []
    const uniqueCategories = [...new Set(products.map((p) => p.categoryName).filter(Boolean))]
    return uniqueCategories.sort()
  }, [products])

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    if (products.length === 0) return []

    let filtered = [...products]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((p) => (p.name ?? '').toLowerCase().includes(searchLower))
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.categoryName === categoryFilter)
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
  }, [products, search, categoryFilter, sortColumn, sortDirection])

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
      pageCode="products"
      title="Продукты"
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск продукта..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <ProductsTableSkeleton />
      ) : error ? (
        <AnalyticsErrorState onRetry={() => refetch()} />
      ) : data ? (
        <ProductsTable
          products={filteredProducts}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      ) : null}

      {/* Pagination info */}
      {data && (
        <div className="mt-4 text-sm text-muted-foreground">
          Показано {filteredProducts.length} из {data.pagination?.total ?? products.length} продуктов
        </div>
      )}
    </AnalyticsPageLayout>
  )
}

// ============================================
// PRODUCTS TABLE
// ============================================

interface IProductsTableProps {
  products: IProductAnalyticsItem[]
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}

function ProductsTable({
  products,
  sortColumn,
  sortDirection,
  onSort,
}: IProductsTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <SortableHeader
              column="name"
              label="Продукт"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <SortableHeader
              column="quantity"
              label="Кол-во"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-right"
            />
            <SortableHeader
              column="revenue"
              label="Выручка"
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
              column="abcClass"
              label="ABC"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              className="text-center"
            />
            <TableHead className="text-right">Тренд</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Нет данных для отображения
              </TableCell>
            </TableRow>
          ) : (
            products.map((product, index) => (
              <TableRow key={product.id ?? index} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name ?? 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.categoryName ?? '-'}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {(product.quantity ?? 0).toLocaleString('ru-RU')}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(product.revenue ?? 0)}
                </TableCell>
                <TableCell className="text-right">{product.share ?? 0}%</TableCell>
                <TableCell className="text-center">
                  <AbcBadge abcClass={product.abcClass ?? 'C'} />
                </TableCell>
                <TableCell className="text-right">
                  <TrendIndicator trend={product.trend ?? 'NEUTRAL'} />
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
      <div className={cn('flex items-center gap-1', className?.includes('text-right') && 'justify-end', className?.includes('text-center') && 'justify-center')}>
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
// ABC BADGE
// ============================================

interface IAbcBadgeProps {
  abcClass: 'A' | 'B' | 'C'
}

function AbcBadge({ abcClass }: IAbcBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-semibold', ABC_CLASS_COLORS[abcClass])}
    >
      {abcClass}
    </Badge>
  )
}

// ============================================
// TREND INDICATOR
// ============================================

interface ITrendIndicatorProps {
  trend: 'UP' | 'DOWN' | 'NEUTRAL'
}

function TrendIndicator({ trend }: ITrendIndicatorProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        trend === 'UP' && 'text-green-600 dark:text-green-500',
        trend === 'DOWN' && 'text-red-600 dark:text-red-500',
        trend === 'NEUTRAL' && 'text-muted-foreground'
      )}
    >
      {trend === 'UP' && <IconArrowUp className="size-3" />}
      {trend === 'DOWN' && <IconArrowDown className="size-3" />}
      {trend === 'NEUTRAL' && <IconMinus className="size-3" />}
    </span>
  )
}

// ============================================
// SKELETON
// ============================================

function ProductsTableSkeleton() {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">#</TableHead>
            <TableHead>Продукт</TableHead>
            <TableHead className="text-right">Кол-во</TableHead>
            <TableHead className="text-right">Выручка</TableHead>
            <TableHead className="text-right">Доля</TableHead>
            <TableHead className="text-center">ABC</TableHead>
            <TableHead className="text-right">Изм.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1 h-3 w-20" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-12" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-10" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="mx-auto h-5 w-8" />
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
