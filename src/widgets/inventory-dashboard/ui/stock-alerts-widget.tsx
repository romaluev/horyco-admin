'use client'

import { Bell, Check } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { ALERT_TYPE_LABELS, ALERT_TYPE_COLORS } from '@/shared/types/inventory'

import { useStockAlerts, useAcknowledgeAlert } from '@/entities/stock'

interface IStockAlertsWidgetProps {
  warehouseId?: number
  size?: number
}

export function StockAlertsWidget({ warehouseId, size = 5 }: IStockAlertsWidgetProps) {
  const { data: alerts, isLoading } = useStockAlerts({
    warehouseId,
    isAcknowledged: false,
    size,
  })
  const { mutate: acknowledge, isPending } = useAcknowledgeAlert()

  const getAlertVariant = (alertType: string) => {
    const color = ALERT_TYPE_COLORS[alertType as keyof typeof ALERT_TYPE_COLORS]
    if (color === 'destructive') return 'destructive'
    if (color === 'warning') return 'outline'
    return 'secondary'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Уведомления
          {alerts && alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Активные уведомления о запасах</CardDescription>
      </CardHeader>
      <CardContent>
        {!warehouseId ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Выберите склад для просмотра
          </p>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        ) : !alerts?.length ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Нет активных уведомлений
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium leading-none">{alert.item?.name}</p>
                    <Badge variant={getAlertVariant(alert.alertType)}>
                      {ALERT_TYPE_LABELS[alert.alertType as keyof typeof ALERT_TYPE_LABELS] ||
                        alert.alertType}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.warehouse?.name} • Текущий: {alert.currentValue}, Порог:{' '}
                    {alert.threshold}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => acknowledge(alert.id)}
                  disabled={isPending}
                  title="Подтвердить"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
