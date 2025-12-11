import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

import type { IRevenueStats } from '@/entities/branch'

interface RevenueChartProps {
  revenue: IRevenueStats
}

export const RevenueChart = ({ revenue }: RevenueChartProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount)
  }

  const calculatePercentage = (amount: number) => {
    return ((amount / revenue.total) * 100).toFixed(0)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Выручка</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-bold">
            {formatCurrency(revenue.total)} UZS
          </p>
          <p className="text-muted-foreground text-sm">Общая выручка</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Наличные</span>
            <span className="font-medium">
              {formatCurrency(revenue.cash)} (
              {calculatePercentage(revenue.cash)}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Карта</span>
            <span className="font-medium">
              {formatCurrency(revenue.card)} (
              {calculatePercentage(revenue.card)}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Электронные платежи</span>
            <span className="font-medium">
              {formatCurrency(revenue.digital)} (
              {calculatePercentage(revenue.digital)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
