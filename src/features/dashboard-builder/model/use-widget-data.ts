'use client'

import { useMemo } from 'react'

import type { IDashboardAnalyticsResponse } from '@/entities/analytics'
import type { WidgetConfig, WidgetData } from '@/entities/dashboard-widget'

interface UseWidgetDataOptions {
  widget: WidgetConfig
  analyticsData?: IDashboardAnalyticsResponse | null
}

export function useWidgetData({
  widget,
  analyticsData,
}: UseWidgetDataOptions): WidgetData | null {
  return useMemo(() => {
    if (!analyticsData) return null

    const { dataField } = widget

    if (dataField.source === 'analytics') {
      return mapAnalyticsData(dataField.field, analyticsData)
    }

    // For other sources, return empty data (to be implemented with real API)
    return null
  }, [widget, analyticsData])
}

function mapAnalyticsData(
  field: string,
  data: IDashboardAnalyticsResponse
): WidgetData {
  switch (field) {
    case 'revenue':
      return {
        value: data.summary.revenue,
        changePercent: data.summary.revenueChangePct ?? undefined,
      }

    case 'orders':
      return {
        value: data.summary.orders,
        changePercent: data.summary.ordersChangePct ?? undefined,
      }

    case 'avgCheck':
      return {
        value: data.summary.avgCheck,
        changePercent: data.summary.avgCheckChangePct ?? undefined,
      }

    case 'topProduct':
      return {
        text: data.summary.topProduct?.name ?? 'Нет данных',
        value: data.summary.topProduct?.orders,
      }

    case 'revenueChart':
      return {
        chartData: data.chart.points.map((point) => ({
          label: formatChartLabel(point.timestamp, data.chart.groupBy),
          value: point.revenue,
        })),
      }

    case 'ordersChart':
      return {
        chartData: data.chart.points.map((point) => ({
          label: formatChartLabel(point.timestamp, data.chart.groupBy),
          value: point.orders,
        })),
      }

    case 'recentOrders':
      return {
        listData: data.recentOrders.map((order) => ({
          id: order.orderId,
          name: `#${order.number}`,
          value: order.total,
          label: order.branch?.name,
        })),
      }

    case 'topProducts':
      return {
        listData: data.topProducts.map((product) => ({
          id: product.productId,
          name: product.name,
          value: product.revenue,
          count: product.orders,
          percent: product.sharePct,
        })),
        chartData: data.topProducts.map((product) => ({
          label: product.name,
          value: product.orders,
        })),
      }

    default:
      return {}
  }
}

function formatChartLabel(timestamp: string, groupBy: string): string {
  const date = new Date(timestamp)

  switch (groupBy) {
    case 'hour':
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    case 'day':
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    case 'week':
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    default:
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }
}
