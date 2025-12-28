'use client'

import { useMemo } from 'react'

import {
  useRankedList,
  useProportions,
  type IDashboardWidget,
  type IPeriodInput,
} from '@/entities/dashboard'

import { ChannelSplitWidget } from './channel-split-widget'
import { PaymentMethodsWidget } from './payment-methods-widget'
import { StaffRankingWidget } from './staff-ranking-widget'
import { TopProductsWidget } from './top-products-widget'
import { WidgetCard } from './widget-card'

interface DashboardWidgetsSectionProps {
  widgets: IDashboardWidget[]
  period: IPeriodInput
  branchId?: number
  className?: string
}

// Widget type configurations
const WIDGET_CONFIG: Record<
  IDashboardWidget['type'],
  {
    title: string
    component: 'topProducts' | 'paymentMethods' | 'channelSplit' | 'staffRanking' | 'hourlyBreakdown' | 'goalProgress' | 'alerts'
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
}

export function DashboardWidgetsSection({
  widgets,
  period,
  branchId,
  className,
}: DashboardWidgetsSectionProps) {
  // Sort widgets by position
  const sortedWidgets = useMemo(
    () => [...widgets].sort((a, b) => a.position - b.position),
    [widgets]
  )

  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-2">
        {sortedWidgets.map((widget) => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            period={period}
            branchId={branchId}
          />
        ))}
      </div>
    </div>
  )
}

// Individual widget renderer
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

// Container components that fetch data
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
