'use client'

import { useMemo } from 'react'

import {
  useRankedList,
  useProportions,
  useTimeSeries,
  type IDashboardWidget,
  type IPeriodInput,
} from '@/entities/dashboard'
import { KpiType } from '@/shared/api/graphql'

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

interface DashboardWidgetsSectionProps {
  widgets: IDashboardWidget[]
  period: IPeriodInput
  branchId?: number
  className?: string
}

type WidgetComponent =
  | 'topProducts'
  | 'paymentMethods'
  | 'channelSplit'
  | 'staffRanking'
  | 'hourlyBreakdown'
  | 'goalProgress'
  | 'alerts'
  | 'revenueOverview'
  | 'ordersChart'
  | 'transactionsSummary'
  | 'performanceRadar'
  | 'dailyComparison'
  | 'incomeExpense'
  | 'customerRatings'
  | 'conversionFunnel'
  | 'ordersByCategory'
  | 'anomalyDetection'
  | 'visitorsTraffic'
  | 'salesMetrics'
  | 'goalRadial'

const WIDGET_CONFIG: Record<
  IDashboardWidget['type'],
  {
    title: string
    component: WidgetComponent
    size?: 'normal' | 'wide' | 'tall'
  }
> = {
  TOP_PRODUCTS: { title: 'Топ продукты', component: 'topProducts' },
  PAYMENT_METHODS: { title: 'Способы оплаты', component: 'paymentMethods' },
  CHANNEL_SPLIT: { title: 'Каналы продаж', component: 'channelSplit' },
  STAFF_RANKING: { title: 'Рейтинг сотрудников', component: 'staffRanking' },
  HOURLY_BREAKDOWN: { title: 'По часам', component: 'hourlyBreakdown' },
  GOAL_PROGRESS: { title: 'Цели', component: 'goalProgress' },
  ALERTS: { title: 'Уведомления', component: 'alerts' },
  CUSTOMER_SEGMENTS: { title: 'Сегменты клиентов', component: 'topProducts' },
  BRANCH_COMPARISON: { title: 'Сравнение филиалов', component: 'topProducts' },
  REVENUE_OVERVIEW: { title: 'Обзор дохода', component: 'revenueOverview', size: 'wide' },
  ORDERS_CHART: { title: 'График заказов', component: 'ordersChart' },
  TRANSACTIONS_SUMMARY: { title: 'Сводка транзакций', component: 'transactionsSummary', size: 'wide' },
  PERFORMANCE_RADAR: { title: 'Эффективность', component: 'performanceRadar' },
  DAILY_COMPARISON: { title: 'Дневное сравнение', component: 'dailyComparison' },
  INCOME_EXPENSE: { title: 'Доходы и расходы', component: 'incomeExpense', size: 'wide' },
  CUSTOMER_RATINGS: { title: 'Рейтинг клиентов', component: 'customerRatings' },
  CONVERSION_FUNNEL: { title: 'Конверсионная воронка', component: 'conversionFunnel' },
  ORDERS_BY_CATEGORY: { title: 'Заказы по категориям', component: 'ordersByCategory' },
  ANOMALY_DETECTION: { title: 'Обнаружение аномалий', component: 'anomalyDetection' },
  VISITORS_TRAFFIC: { title: 'Трафик посетителей', component: 'visitorsTraffic' },
  SALES_METRICS: { title: 'Метрики продаж', component: 'salesMetrics', size: 'wide' },
  GOAL_RADIAL: { title: 'Прогресс целей', component: 'goalRadial' },
}

export function DashboardWidgetsSection({
  widgets,
  period,
  branchId,
  className,
}: DashboardWidgetsSectionProps) {
  const sortedWidgets = useMemo(
    () => [...widgets].sort((a, b) => a.position - b.position),
    [widgets]
  )

  const wideWidgets = sortedWidgets.filter(
    (w) => WIDGET_CONFIG[w.type]?.size === 'wide'
  )
  const normalWidgets = sortedWidgets.filter(
    (w) => WIDGET_CONFIG[w.type]?.size !== 'wide'
  )

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

interface WidgetRendererProps {
  widget: IDashboardWidget
  period: IPeriodInput
  branchId?: number
}

function WidgetRenderer({ widget, period, branchId }: WidgetRendererProps) {
  const config = WIDGET_CONFIG[widget.type]

  switch (widget.type) {
    case 'TOP_PRODUCTS':
      return (
        <TopProductsWidgetContainer
          title={config.title}
          period={period}
          branchId={branchId}
        />
      )
    case 'PAYMENT_METHODS':
      return (
        <PaymentMethodsWidgetContainer
          title={config.title}
          period={period}
          branchId={branchId}
        />
      )
    case 'CHANNEL_SPLIT':
      return (
        <ChannelSplitWidgetContainer
          title={config.title}
          period={period}
          branchId={branchId}
        />
      )
    case 'STAFF_RANKING':
      return (
        <StaffRankingWidgetContainer
          title={config.title}
          period={period}
          branchId={branchId}
        />
      )
    case 'REVENUE_OVERVIEW':
      return (
        <RevenueOverviewWidgetContainer
          period={period}
          branchId={branchId}
        />
      )
    case 'TRANSACTIONS_SUMMARY':
      return (
        <TransactionsSummaryWidgetContainer
          period={period}
          branchId={branchId}
        />
      )
    case 'PERFORMANCE_RADAR':
      return <PerformanceRadarWidget />
    case 'DAILY_COMPARISON':
      return <DailyComparisonWidget />
    case 'INCOME_EXPENSE':
      return <IncomeExpenseWidget />
    case 'CUSTOMER_RATINGS':
      return <CustomerRatingsWidget />
    case 'CONVERSION_FUNNEL':
      return <ConversionFunnelWidget />
    case 'ORDERS_BY_CATEGORY':
      return <OrdersByCategoryWidget />
    case 'ANOMALY_DETECTION':
      return <AnomalyDetectionWidget />
    case 'VISITORS_TRAFFIC':
      return <VisitorsTrafficWidget />
    case 'SALES_METRICS':
      return <SalesMetricsWidget />
    case 'GOAL_RADIAL':
      return <GoalRadialWidget />
    default:
      return (
        <WidgetCard title={config.title}>
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            Скоро
          </div>
        </WidgetCard>
      )
  }
}

interface WidgetContainerProps {
  title: string
  period: IPeriodInput
  branchId?: number
}

function TopProductsWidgetContainer({ title, period, branchId }: WidgetContainerProps) {
  const { data, isLoading, error, refetch } = useRankedList({
    dataset: 'PRODUCTS',
    period,
    sortBy: 'REVENUE',
    limit: 5,
    branchId,
  })

  return (
    <WidgetCard
      title={title}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      contentClassName="h-64"
    >
      <TopProductsWidget data={data ?? []} isLoading={isLoading} />
    </WidgetCard>
  )
}

function PaymentMethodsWidgetContainer({ title, period, branchId }: WidgetContainerProps) {
  const { data, isLoading, error, refetch } = useProportions({
    dimension: 'PAYMENT_METHOD',
    period,
    branchId,
  })

  return (
    <WidgetCard
      title={title}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      contentClassName="h-64"
    >
      <PaymentMethodsWidget data={data ?? null} isLoading={isLoading} />
    </WidgetCard>
  )
}

function ChannelSplitWidgetContainer({ title, period, branchId }: WidgetContainerProps) {
  const { data, isLoading, error, refetch } = useProportions({
    dimension: 'CHANNEL',
    period,
    branchId,
  })

  return (
    <WidgetCard
      title={title}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      contentClassName="h-64"
    >
      <ChannelSplitWidget data={data ?? null} isLoading={isLoading} />
    </WidgetCard>
  )
}

function StaffRankingWidgetContainer({ title, period, branchId }: WidgetContainerProps) {
  const { data, isLoading, error, refetch } = useRankedList({
    dataset: 'STAFF',
    period,
    sortBy: 'REVENUE',
    limit: 5,
    branchId,
  })

  return (
    <WidgetCard
      title={title}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      contentClassName="h-64"
    >
      <StaffRankingWidget data={data ?? []} isLoading={isLoading} />
    </WidgetCard>
  )
}

function RevenueOverviewWidgetContainer({
  period,
  branchId,
}: Omit<WidgetContainerProps, 'title'>) {
  const { data, isLoading } = useTimeSeries({
    metric: KpiType.REVENUE,
    period,
    branchId,
  })

  return <RevenueOverviewWidget data={data ?? null} isLoading={isLoading} />
}

function TransactionsSummaryWidgetContainer({
  period,
  branchId,
}: Omit<WidgetContainerProps, 'title'>) {
  const { data, isLoading } = useTimeSeries({
    metric: KpiType.ORDERS,
    period,
    branchId,
  })

  return <TransactionsSummaryWidget data={data ?? null} isLoading={isLoading} />
}
