/**
 * Financial Analytics Page
 * Based on docs: 25-analytics-pages.md - Part 8: Financial Analytics
 *
 * ULTRA tier - Requires analytics_full entitlement
 * Shows P&L, margins, and financial metrics
 */

'use client'

import * as React from 'react'

import { IconArrowDown, IconArrowUp, IconMinus } from '@tabler/icons-react'

import { PeriodType } from '@/shared/api/graphql'
import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/base/badge'
import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'

import {
  useProfitLoss,
  useMarginAnalysis,
  AnalyticsPageLayout,
  AnalyticsErrorState,
  MARGIN_CLASS_COLORS,
} from '@/features/analytics'


// ============================================
// MAIN COMPONENT
// ============================================

export default function FinancialAnalyticsPage() {
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.THIS_MONTH)
  const [activeTab, setActiveTab] = React.useState('pnl')

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export financial analytics')
  }

  return (
    <AnalyticsPageLayout
      pageCode="financial"
      title="Финансы"
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pnl">P&L</TabsTrigger>
          <TabsTrigger value="margins">Маржинальность</TabsTrigger>
        </TabsList>

        <TabsContent value="pnl" className="mt-4">
          <ProfitLossTab period={period} />
        </TabsContent>

        <TabsContent value="margins" className="mt-4">
          <MarginAnalysisTab period={period} />
        </TabsContent>
      </Tabs>
    </AnalyticsPageLayout>
  )
}

// ============================================
// PROFIT & LOSS TAB
// ============================================

interface IProfitLossTabProps {
  period: PeriodType
}

// API response structure from the server
interface IProfitLossPeriodData {
  periodStart: string
  periodEnd: string
  grossRevenue: number
  discounts: number
  refunds: number
  netRevenue: number
  cogs: number
  grossProfit: number
  grossMarginPercent: number
  operatingExpenses: {
    category: string
    name: string
    amount: number
    percentage: number
  }[]
  totalOperatingExpenses: number
  operatingProfit: number
  operatingMarginPercent: number
  totalOrders: number
  averageOrderValue: number
  revenuePerOrder: number
}

interface IProfitLossApiResponse {
  current: IProfitLossPeriodData
  previous: IProfitLossPeriodData
  insights: string[]
  revenueChange: {
    current: number
    previous: number
    change: number
    changePercent: number
    trend: 'up' | 'down' | 'neutral'
  }
  grossProfitChange: {
    current: number
    previous: number
    change: number
    changePercent: number
    trend: 'up' | 'down' | 'neutral'
  }
  operatingProfitChange: {
    current: number
    previous: number
    change: number
    changePercent: number
    trend: 'up' | 'down' | 'neutral'
  }
}

function ProfitLossTab({ period }: IProfitLossTabProps) {
  const { data: rawData, isLoading, error, refetch } = useProfitLoss({
    period: { type: period },
    comparePreviousPeriod: true,
  })

  if (isLoading) return <PnlSkeleton />
  if (error) return <AnalyticsErrorState onRetry={() => refetch()} />
  if (!rawData) return null

  // Cast to the actual API response structure
  const data = rawData as unknown as IProfitLossApiResponse
  const current = data.current
  const previous = data.previous

  // Build revenue items from the API structure
  const revenueItems = [
    { label: 'Валовая выручка', currentValue: current.grossRevenue, previousValue: previous.grossRevenue },
    { label: 'Скидки', currentValue: -current.discounts, previousValue: -previous.discounts },
    { label: 'Возвраты', currentValue: -current.refunds, previousValue: -previous.refunds },
    { label: 'Чистая выручка', currentValue: current.netRevenue, previousValue: previous.netRevenue, isTotal: true },
    { label: 'Себестоимость', currentValue: current.cogs, previousValue: previous.cogs },
    { label: 'Валовая прибыль', currentValue: current.grossProfit, previousValue: previous.grossProfit, isTotal: true },
  ]

  // Build expense items from operatingExpenses
  interface IExpenseItem {
    label: string
    currentValue: number
    previousValue: number
    isTotal?: boolean
  }

  const expenseItems: IExpenseItem[] = [
    ...current.operatingExpenses.map((exp, idx) => ({
      label: exp.name,
      currentValue: exp.amount,
      previousValue: previous.operatingExpenses[idx]?.amount ?? 0,
    })),
    {
      label: 'Итого операционные расходы',
      currentValue: current.totalOperatingExpenses,
      previousValue: previous.totalOperatingExpenses,
      isTotal: true,
    },
  ]

  const operatingProfit = current.operatingProfit
  const previousOperatingProfit = previous.operatingProfit
  const operatingMargin = current.operatingMarginPercent
  const previousOperatingMargin = previous.operatingMarginPercent

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard
          label="Чистая выручка"
          value={formatPrice(current.netRevenue)}
          suffix={`${data.revenueChange.trend === 'up' ? '+' : ''}${data.revenueChange.changePercent.toFixed(1)}%`}
        />
        <MetricCard
          label="Валовая прибыль"
          value={formatPrice(current.grossProfit)}
          suffix={`${current.grossMarginPercent}%`}
        />
        <MetricCard
          label="Операционная прибыль"
          value={formatPrice(current.operatingProfit)}
          suffix={`${current.operatingMarginPercent}%`}
        />
        <MetricCard
          label="Средний чек"
          value={formatPrice(current.averageOrderValue)}
          suffix={`${current.totalOrders} заказов`}
        />
      </div>

      <h3 className="text-sm font-medium">Отчет о прибылях и убытках</h3>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Статья</TableHead>
              <TableHead className="text-right">Текущий период</TableHead>
              <TableHead className="text-right">Предыдущий период</TableHead>
              <TableHead className="text-right">Изменение</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Revenue Section */}
            <TableRow className="bg-muted/30">
              <TableCell colSpan={4} className="font-medium">Выручка</TableCell>
            </TableRow>
            {revenueItems.map((item, index) => (
              <TableRow key={item.label ?? index} className={cn(item.isTotal && 'bg-muted/50 font-medium')}>
                <TableCell className={cn(!item.isTotal && 'pl-6')}>{item.label}</TableCell>
                <TableCell className="text-right">
                  {item.currentValue < 0 ? `(${formatPrice(Math.abs(item.currentValue))})` : formatPrice(item.currentValue)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {item.previousValue < 0 ? `(${formatPrice(Math.abs(item.previousValue))})` : formatPrice(item.previousValue)}
                </TableCell>
                <TableCell className="text-right">
                  <ChangeIndicator
                    value={calculateChange(item.currentValue, item.previousValue)}
                    inverted={item.currentValue < 0}
                  />
                </TableCell>
              </TableRow>
            ))}

            {/* Expenses Section */}
            <TableRow className="bg-muted/30">
              <TableCell colSpan={4} className="font-medium">Операционные расходы</TableCell>
            </TableRow>
            {expenseItems.map((item, index) => (
              <TableRow key={item.label ?? index} className={cn(item.isTotal && 'bg-muted/50 font-medium')}>
                <TableCell className={cn(!item.isTotal && 'pl-6')}>{item.label}</TableCell>
                <TableCell className="text-right">{formatPrice(item.currentValue)}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatPrice(item.previousValue)}
                </TableCell>
                <TableCell className="text-right">
                  <ChangeIndicator value={calculateChange(item.currentValue, item.previousValue)} inverted />
                </TableCell>
              </TableRow>
            ))}

            {/* Operating Profit */}
            <TableRow className="border-t-2 bg-primary/5 font-semibold">
              <TableCell>Операционная прибыль</TableCell>
              <TableCell className="text-right">{formatPrice(operatingProfit)}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatPrice(previousOperatingProfit)}
              </TableCell>
              <TableCell className="text-right">
                <ChangeIndicator
                  value={calculateChange(operatingProfit, previousOperatingProfit)}
                />
              </TableCell>
            </TableRow>

            {/* Operating Margin */}
            <TableRow className="bg-primary/5 font-semibold">
              <TableCell>Операционная рентабельность</TableCell>
              <TableCell className="text-right">{operatingMargin.toFixed(1)}%</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {previousOperatingMargin.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={cn(
                    operatingMargin > previousOperatingMargin
                      ? 'text-green-600 dark:text-green-500'
                      : operatingMargin < previousOperatingMargin
                        ? 'text-red-600 dark:text-red-500'
                        : 'text-muted-foreground'
                  )}
                >
                  {operatingMargin > previousOperatingMargin ? '+' : ''}
                  {(operatingMargin - previousOperatingMargin).toFixed(1)}пп
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Insights */}
      {data.insights && data.insights.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h4 className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-300">Инсайты</h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-blue-700 dark:text-blue-400">
            {data.insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Helper function to calculate change percentage
function calculateChange(current?: number, previous?: number): number {
  const curr = current ?? 0
  const prev = previous ?? 0
  if (prev === 0) return 0
  return ((curr - prev) / Math.abs(prev)) * 100
}

// ============================================
// MARGIN ANALYSIS TAB
// ============================================

interface IMarginAnalysisTabProps {
  period: PeriodType
}

function MarginAnalysisTab({ period }: IMarginAnalysisTabProps) {
  const { data, isLoading, error, refetch } = useMarginAnalysis({
    period: { type: period },
  })

  if (isLoading) return <MarginSkeleton />
  if (error) return <AnalyticsErrorState onRetry={() => refetch()} />
  if (!data) return null

  const summary = data.summary ?? {}
  const products = data.products ?? []

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="Средняя маржа" value={`${(summary.avgMargin ?? 0).toFixed(1)}%`} />
        <MetricCard label="Высокая маржа" value={summary.highMarginCount ?? 0} suffix="товаров" />
        <MetricCard label="Низкая маржа" value={summary.lowMarginCount ?? 0} suffix="товаров" />
        <MetricCard label="Отрицательная" value={summary.negativeCount ?? 0} suffix="товаров" />
      </div>

      {/* Products Table */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Продукты по маржинальности</h3>
        {products.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Продукт</TableHead>
                  <TableHead className="text-right">Себестоимость</TableHead>
                  <TableHead className="text-right">Цена</TableHead>
                  <TableHead className="text-right">Маржа</TableHead>
                  <TableHead className="text-center">Класс</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name ?? 'N/A'}</TableCell>
                    <TableCell className="text-right">{formatPrice(product.cost ?? 0)}</TableCell>
                    <TableCell className="text-right">{formatPrice(product.price ?? 0)}</TableCell>
                    <TableCell className="text-right">{(product.margin ?? 0).toFixed(1)}%</TableCell>
                    <TableCell className="text-center">
                      <MarginBadge marginClass={product.marginClass ?? 'LOW'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg border text-muted-foreground">
            Нет данных о маржинальности продуктов
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// METRIC CARD
// ============================================

interface IMetricCardProps {
  label: string
  value: string | number
  suffix?: string
}

function MetricCard({ label, value, suffix }: IMetricCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-semibold">
          {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
        </span>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  )
}

// ============================================
// MARGIN BADGE
// ============================================

interface IMarginBadgeProps {
  marginClass: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEGATIVE'
}

function MarginBadge({ marginClass }: IMarginBadgeProps) {
  const labels: Record<string, string> = {
    HIGH: 'Высокая',
    MEDIUM: 'Средняя',
    LOW: 'Низкая',
    NEGATIVE: 'Отрицательная',
  }

  return (
    <Badge
      variant="outline"
      className={cn('font-medium', MARGIN_CLASS_COLORS[marginClass])}
    >
      {labels[marginClass]}
    </Badge>
  )
}

// ============================================
// CHANGE INDICATOR
// ============================================

interface IChangeIndicatorProps {
  value: number
  inverted?: boolean
}

function ChangeIndicator({ value, inverted = false }: IChangeIndicatorProps) {
  const isPositive = inverted ? value < 0 : value > 0
  const isNegative = inverted ? value > 0 : value < 0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        isPositive && 'text-green-600 dark:text-green-500',
        isNegative && 'text-red-600 dark:text-red-500',
        !isPositive && !isNegative && 'text-muted-foreground'
      )}
    >
      {value > 0 && <IconArrowUp className="size-3" />}
      {value < 0 && <IconArrowDown className="size-3" />}
      {value === 0 && <IconMinus className="size-3" />}
      {value > 0 ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  )
}

// ============================================
// SKELETONS
// ============================================

function PnlSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-96 rounded-lg" />
    </div>
  )
}

function MarginSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}
