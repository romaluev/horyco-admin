'use client'

import * as React from 'react'
// Импортируем только необходимые функции

import { AnalyticsChart } from './analytics-chart'
import { AnalyticsMetrics } from './analytics-metrics'
import { PeriodFilter } from './period-filter'
import { RecentOrders } from './recent-orders'

import type { ChartDataWithCast , ChartData } from './analytics-chart'
import type { PeriodType, DateRange } from './period-filter'
import type { RecentOrder } from './recent-orders'

// Моковые данные для метрик
const mockMetricsData = {
  revenue: 2580000,
  ordersCount: 145,
  averageCheck: 17793,
  topDish: {
    id: '1',
    name: 'Плов "Чайхана"',
    quantity: 48,
    revenue: 144000,
  },
  previousPeriod: {
    revenue: 2350000,
    ordersCount: 132,
    averageCheck: 17803,
  },
}

// Моковые данные для графика по выручке
const mockRevenueChartData = {
  data: [
    { date: '2025-08-10T08:00:00', value: 120000 },
    { date: '2025-08-10T09:00:00', value: 180000 },
    { date: '2025-08-10T10:00:00', value: 210000 },
    { date: '2025-08-10T11:00:00', value: 250000 },
    { date: '2025-08-10T12:00:00', value: 320000 },
    { date: '2025-08-10T13:00:00', value: 380000 },
    { date: '2025-08-10T14:00:00', value: 290000 },
    { date: '2025-08-10T15:00:00', value: 240000 },
    { date: '2025-08-10T16:00:00', value: 220000 },
    { date: '2025-08-10T17:00:00', value: 270000 },
    { date: '2025-08-10T18:00:00', value: 300000 },
  ],
  metric: 'revenue',
  period: 'hour',
}

// Моковые данные для графика по заказам
const mockOrdersChartData = {
  data: [
    { date: '2025-08-10T08:00:00', value: 8 },
    { date: '2025-08-10T09:00:00', value: 12 },
    { date: '2025-08-10T10:00:00', value: 15 },
    { date: '2025-08-10T11:00:00', value: 18 },
    { date: '2025-08-10T12:00:00', value: 22 },
    { date: '2025-08-10T13:00:00', value: 25 },
    { date: '2025-08-10T14:00:00', value: 19 },
    { date: '2025-08-10T15:00:00', value: 16 },
    { date: '2025-08-10T16:00:00', value: 14 },
    { date: '2025-08-10T17:00:00', value: 18 },
    { date: '2025-08-10T18:00:00', value: 20 },
  ],
  metric: 'orders',
  period: 'hour',
}

// Моковые данные для графика по среднему чеку
const mockAverageChartData = {
  data: [
    { date: '2025-08-10T08:00:00', value: 15000 },
    { date: '2025-08-10T09:00:00', value: 15500 },
    { date: '2025-08-10T10:00:00', value: 16200 },
    { date: '2025-08-10T11:00:00', value: 16800 },
    { date: '2025-08-10T12:00:00', value: 17500 },
    { date: '2025-08-10T13:00:00', value: 18200 },
    { date: '2025-08-10T14:00:00', value: 17800 },
    { date: '2025-08-10T15:00:00', value: 17200 },
    { date: '2025-08-10T16:00:00', value: 16900 },
    { date: '2025-08-10T17:00:00', value: 17500 },
    { date: '2025-08-10T18:00:00', value: 18000 },
  ],
  metric: 'average',
  period: 'hour',
}

// Моковые данные для последних заказов
const mockRecentOrders: RecentOrder[] = [
  {
    id: '1',
    orderNumber: '2508',
    createdAt: '2025-08-10T17:45:00',
    total: 58000,
    items: [
      { name: 'Плов "Чайхана"', quantity: 1, price: 30000 },
      { name: 'Манты с говядиной', quantity: 1, price: 28000 },
    ],
    type: 'dine-in',
  },
  {
    id: '2',
    orderNumber: '2507',
    createdAt: '2025-08-10T17:32:00',
    total: 42000,
    items: [
      { name: 'Шашлык из баранины', quantity: 1, price: 35000 },
      { name: 'Чай зеленый', quantity: 1, price: 7000 },
    ],
    customer: {
      name: 'Алишер',
      phone: '+998 90 123 45 67',
    },
    type: 'delivery',
  },
  {
    id: '3',
    orderNumber: '2506',
    createdAt: '2025-08-10T17:15:00',
    total: 65000,
    items: [
      { name: 'Лагман', quantity: 1, price: 25000 },
      { name: 'Самса с курицей', quantity: 2, price: 15000 },
      { name: 'Компот', quantity: 2, price: 5000 },
    ],
    customer: {
      name: 'Дильшод',
    },
    type: 'takeaway',
  },
  {
    id: '4',
    orderNumber: '2505',
    createdAt: '2025-08-10T17:05:00',
    total: 37000,
    items: [
      { name: 'Манты с говядиной', quantity: 1, price: 28000 },
      { name: 'Чай зеленый', quantity: 1, price: 7000 },
      { name: 'Пахлава', quantity: 1, price: 12000 },
    ],
    type: 'dine-in',
  },
  {
    id: '5',
    orderNumber: '2504',
    createdAt: '2025-08-10T16:58:00',
    total: 82000,
    items: [
      { name: 'Плов "Чайхана"', quantity: 2, price: 30000 },
      { name: 'Шашлык из баранины', quantity: 1, price: 35000 },
      { name: 'Компот', quantity: 2, price: 5000 },
    ],
    customer: {
      name: 'Фархад',
      phone: '+998 90 987 65 43',
    },
    type: 'delivery',
  },
] as const

export function AnalyticsOverview() {
  // Состояние для выбранного периода и диапазона дат
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodType>('hour')
  const [selectedDateRange, setSelectedDateRange] = React.useState<DateRange>({
    from: new Date(),
    to: undefined,
  })

  // Состояние для выбранной метрики графика
  const [selectedMetric, setSelectedMetric] = React.useState<
    'revenue' | 'orders' | 'average'
  >('revenue')

  // Состояние для загрузки данных
  const [isLoading, setIsLoading] = React.useState(false)

  // Данные для графика в зависимости от выбранной метрики
  const chartData = React.useMemo(() => {
    let data: ChartDataWithCast

    switch (selectedMetric) {
      case 'revenue':
        data = {
          ...mockRevenueChartData,
          period: selectedPeriod,
          metric: selectedMetric,
        }
        break
      case 'orders':
        data = {
          ...mockOrdersChartData,
          period: selectedPeriod,
          metric: selectedMetric,
        }
        break
      case 'average':
        data = {
          ...mockAverageChartData,
          period: selectedPeriod,
          metric: selectedMetric,
        }
        break
      default:
        data = {
          ...mockRevenueChartData,
          period: selectedPeriod,
          metric: 'revenue',
        }
    }

    return data as ChartData
  }, [selectedMetric, selectedPeriod])

  // Обработчик изменения периода
  const handlePeriodChange = (period: PeriodType) => {
    setIsLoading(true)
    setSelectedPeriod(period)

    // Имитация загрузки данных
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  // Обработчик изменения диапазона дат
  const handleDateRangeChange = (range: DateRange) => {
    setIsLoading(true)
    setSelectedDateRange(range)

    // Имитация загрузки данных
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  // Обработчик изменения метрики графика
  const handleMetricChange = (metric: 'revenue' | 'orders' | 'average') => {
    setSelectedMetric(metric)
  }

  // Эффект для имитации загрузки данных при первом рендере
  React.useEffect(() => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Аналитика продаж</h2>
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          selectedRange={selectedDateRange}
          onPeriodChange={handlePeriodChange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-4">
          <div className="space-y-4">
            <AnalyticsMetrics
              metrics={mockMetricsData}
              period={selectedPeriod}
              dateRange={selectedDateRange}
              isLoading={isLoading}
              selectedRange={selectedDateRange}
              selectedPeriod={selectedPeriod}
            />

            <AnalyticsChart
              data={chartData}
              onMetricChange={handleMetricChange}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <RecentOrders
            orders={mockRecentOrders}
            isLoading={isLoading}
            compact
          />
        </div>
      </div>
    </div>
  )
}
