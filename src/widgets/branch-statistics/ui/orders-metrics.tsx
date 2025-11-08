import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

import type { IOrderStats } from '@/entities/branch'

interface OrdersMetricsProps {
  orders: IOrderStats
}

export const OrdersMetrics = ({ orders }: OrdersMetricsProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num)
  }

  const completionRate = ((orders.completed / orders.total) * 100).toFixed(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заказы</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-bold">{orders.total}</p>
            <p className="text-muted-foreground text-sm">Всего</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">
              {orders.completed}
            </p>
            <p className="text-muted-foreground text-sm">Завершено</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Отменено</span>
            <span className="text-destructive font-medium">
              {orders.cancelled}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Процент выполнения</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Средний чек</span>
            <span className="font-medium">
              {formatNumber(orders.averageValue)} UZS
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
