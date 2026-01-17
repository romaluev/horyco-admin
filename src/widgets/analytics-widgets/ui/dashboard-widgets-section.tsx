'use client'

import { useMemo, type ComponentType } from 'react'

import { KpiType } from '@/shared/api/graphql'

import {
  useRankedList,
  useProportions,
  useTimeSeries,
  WIDGET_CONFIG,
  type IDashboardWidget,
  type IPeriodInput,
  type WidgetType,
} from '@/entities/dashboard'

import { AnomalyDetectionWidget } from './anomaly-detection-widget'
import { ChannelSplitWidget } from './channel-split-widget'
import { ConversionFunnelWidget } from './conversion-funnel-widget'
import { CustomerRatingsWidget } from './customer-ratings-widget'
import { DailyComparisonWidget } from './daily-comparison-widget'
import { GoalRadialWidget } from './goal-radial-widget'
import { IncomeExpenseWidget } from './income-expense-widget'
import { OrdersByCategoryWidget } from './orders-by-category-widget'
import { PaymentMethodsWidget } from './payment-methods-widget'
import { PerformanceRadarWidget } from './performance-radar-widget'
import { RevenueOverviewWidget } from './revenue-overview-widget'
import { SalesMetricsWidget } from './sales-metrics-widget'
import { StaffRankingWidget } from './staff-ranking-widget'
import { TopProductsWidget } from './top-products-widget'
import { TransactionsSummaryWidget } from './transactions-summary-widget'
import { VisitorsTrafficWidget } from './visitors-traffic-widget'
import { WidgetCard } from './widget-card'

interface IDashboardWidgetsSectionProps {
  widgets: IDashboardWidget[]
  period: IPeriodInput
  branchId?: number
  className?: string
}

interface IWidgetContainerProps {
  period: IPeriodInput
  branchId?: number
}

// ============================================
// WIDGET COMPONENT MAP (replaces switch)
// ============================================

// Static widgets (no data fetching needed)
const STATIC_WIDGETS: Partial<Record<WidgetType, ComponentType>> = {
  PERFORMANCE_RADAR: PerformanceRadarWidget,
  DAILY_COMPARISON: DailyComparisonWidget,
  INCOME_EXPENSE: IncomeExpenseWidget,
  CUSTOMER_RATINGS: CustomerRatingsWidget,
  CONVERSION_FUNNEL: ConversionFunnelWidget,
  ORDERS_BY_CATEGORY: OrdersByCategoryWidget,
  ANOMALY_DETECTION: AnomalyDetectionWidget,
  VISITORS_TRAFFIC: VisitorsTrafficWidget,
  SALES_METRICS: SalesMetricsWidget,
  GOAL_RADIAL: GoalRadialWidget,
}

// Dynamic widgets (need data fetching containers)
const CONTAINER_WIDGETS: Record<string, ComponentType<IWidgetContainerProps>> = {
  TOP_PRODUCTS: TopProductsContainer,
  PAYMENT_METHODS: PaymentMethodsContainer,
  CHANNEL_SPLIT: ChannelSplitContainer,
  STAFF_RANKING: StaffRankingContainer,
  REVENUE_OVERVIEW: RevenueOverviewContainer,
  TRANSACTIONS_SUMMARY: TransactionsSummaryContainer,
}

export function DashboardWidgetsSection({
  widgets,
  period,
  branchId,
  className,
}: IDashboardWidgetsSectionProps) {
  const sortedWidgets = useMemo(
    () => [...widgets].sort((a, b) => a.position - b.position),
    [widgets]
  )

  const wideWidgets = sortedWidgets.filter((w) => WIDGET_CONFIG[w.type]?.size === 'wide')
  const normalWidgets = sortedWidgets.filter((w) => WIDGET_CONFIG[w.type]?.size !== 'wide')

  return (
    <div className={className}>
      <div className="space-y-4">
        {wideWidgets.map((widget) => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            period={period}
            branchId={branchId}
          />
        ))}

        <div className="grid gap-4 md:grid-cols-2">
          {normalWidgets.map((widget) => (
            <WidgetRenderer
              key={widget.id}
              widget={widget}
              period={period}
              branchId={branchId}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface IWidgetRendererProps {
  widget: IDashboardWidget
  period: IPeriodInput
  branchId?: number
}

function WidgetRenderer({ widget, period, branchId }: IWidgetRendererProps) {
  const config = WIDGET_CONFIG[widget.type]

  // Check static widgets first
  const StaticComponent = STATIC_WIDGETS[widget.type]
  if (StaticComponent) {
    return <StaticComponent />
  }

  // Check container widgets
  const ContainerComponent = CONTAINER_WIDGETS[widget.type]
  if (ContainerComponent) {
    return <ContainerComponent period={period} branchId={branchId} />
  }

  // Fallback for unimplemented widgets
  return (
    <WidgetCard title={config?.title ?? widget.type}>
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Скоро
      </div>
    </WidgetCard>
  )
}

function TopProductsContainer({ period, branchId }: IWidgetContainerProps) {
  const { data, isLoading, error, refetch } = useRankedList({
    dataset: 'PRODUCTS',
    period,
    sortBy: 'REVENUE',
    limit: 5,
    branchId,
  })

  return (
    <WidgetCard
      title={WIDGET_CONFIG.TOP_PRODUCTS.title}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      contentClassName="h-64"
    >
      <TopProductsWidget data={data ?? []} isLoading={isLoading} />
    </WidgetCard>
  )
}

function PaymentMethodsContainer({ period, branchId }: IWidgetContainerProps) {
  const { data, isLoading, error, refetch } = useProportions({
    dimension: 'PAYMENT_METHOD',
    period,
    branchId,
  })

  return (
    <WidgetCard
      title={WIDGET_CONFIG.PAYMENT_METHODS.title}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      contentClassName="h-64"
    >
      <PaymentMethodsWidget data={data ?? null} isLoading={isLoading} />
    </WidgetCard>
  )
}

function ChannelSplitContainer({ period, branchId }: IWidgetContainerProps) {
  const { data, isLoading, error, refetch } = useProportions({
    dimension: 'CHANNEL',
    period,
    branchId,
  })

  return (
    <WidgetCard
      title={WIDGET_CONFIG.CHANNEL_SPLIT.title}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      contentClassName="h-64"
    >
      <ChannelSplitWidget data={data ?? null} isLoading={isLoading} />
    </WidgetCard>
  )
}

function StaffRankingContainer({ period, branchId }: IWidgetContainerProps) {
  const { data, isLoading, error, refetch } = useRankedList({
    dataset: 'STAFF',
    period,
    sortBy: 'REVENUE',
    limit: 5,
    branchId,
  })

  return (
    <WidgetCard
      title={WIDGET_CONFIG.STAFF_RANKING.title}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      contentClassName="h-64"
    >
      <StaffRankingWidget data={data ?? []} isLoading={isLoading} />
    </WidgetCard>
  )
}

function RevenueOverviewContainer({ period, branchId }: IWidgetContainerProps) {
  const { data, isLoading } = useTimeSeries({
    metric: KpiType.REVENUE,
    period,
    branchId,
  })

  return <RevenueOverviewWidget data={data ?? null} isLoading={isLoading} />
}

function TransactionsSummaryContainer({ period, branchId }: IWidgetContainerProps) {
  const { data, isLoading } = useTimeSeries({
    metric: KpiType.ORDERS,
    period,
    branchId,
  })

  return <TransactionsSummaryWidget data={data ?? null} isLoading={isLoading} />
}
