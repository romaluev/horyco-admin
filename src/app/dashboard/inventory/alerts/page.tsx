'use client'

import { useState } from 'react'

import Link from 'next/link'

import { IconBell, IconCheck, IconAlertTriangle, IconPackageOff, IconChecks } from '@tabler/icons-react'

import { ALERT_TYPE_LABELS, ALERT_TYPE_COLORS, type AlertType } from '@/shared/types/inventory'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Heading } from '@/shared/ui/base/heading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Separator } from '@/shared/ui/base/separator'
import { Skeleton } from '@/shared/ui/base/skeleton'
import PageContainer from '@/shared/ui/layout/page-container'

import { useStockAlerts, useAcknowledgeAlert, useAcknowledgeAllAlerts } from '@/entities/stock'
import { WarehouseSelector } from '@/entities/warehouse'

const alertTypeOptions = [
  { value: 'all', label: 'Все типы' },
  { value: 'OUT_OF_STOCK', label: 'Нет в наличии' },
  { value: 'LOW_STOCK', label: 'Низкий остаток' },
  { value: 'OVERSTOCK', label: 'Избыточный запас' },
  { value: 'EXPIRING_SOON', label: 'Скоро истекает срок' },
]

const statusOptions = [
  { value: 'unacknowledged', label: 'Непрочитанные' },
  { value: 'acknowledged', label: 'Прочитанные' },
  { value: 'all', label: 'Все' },
]

function getAlertIcon(alertType: string) {
  if (alertType === 'OUT_OF_STOCK') {
    return <IconPackageOff className="h-5 w-5 text-destructive" />
  }
  return <IconAlertTriangle className="h-5 w-5 text-yellow-500" />
}

function getAlertBadgeVariant(
  alertType: string
): 'default' | 'destructive' | 'secondary' | 'outline' {
  const color = ALERT_TYPE_COLORS[alertType as AlertType]
  if (color === 'destructive') return 'destructive'
  if (color === 'warning') return 'outline'
  return 'secondary'
}

export default function AlertsPage() {
  const [warehouseId, setWarehouseId] = useState<number | undefined>()
  const [alertType, setAlertType] = useState<string>('all')
  const [status, setStatus] = useState<string>('unacknowledged')

  const { data: alerts, isLoading } = useStockAlerts({
    warehouseId,
    alertType: alertType !== 'all' ? alertType : undefined,
    isAcknowledged: status === 'all' ? undefined : status === 'acknowledged',
  })

  const { mutate: acknowledgeAlert, isPending: isAcknowledging } = useAcknowledgeAlert()
  const { mutate: acknowledgeAllAlerts, isPending: isAcknowledgingAll } = useAcknowledgeAllAlerts()

  const handleAcknowledge = (id: number) => {
    acknowledgeAlert(id)
  }

  const handleAcknowledgeAll = () => {
    if (warehouseId) {
      acknowledgeAllAlerts(warehouseId)
    }
  }

  const hasUnacknowledged = alerts?.some((a) => !a.isAcknowledged)

  // Group alerts by type for summary
  const alertSummary = {
    outOfStock: alerts?.filter((a) => a.alertType === 'OUT_OF_STOCK').length || 0,
    lowStock: alerts?.filter((a) => a.alertType === 'LOW_STOCK').length || 0,
    overstock: alerts?.filter((a) => a.alertType === 'OVERSTOCK').length || 0,
    expiring: alerts?.filter((a) => a.alertType === 'EXPIRING_SOON').length || 0,
  }

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Уведомления о запасах"
            description="Управление уведомлениями о низких остатках и критических ситуациях"
          />
          {warehouseId && hasUnacknowledged && (
            <Button
              variant="outline"
              onClick={handleAcknowledgeAll}
              disabled={isAcknowledgingAll}
            >
              <IconChecks className="mr-2 h-4 w-4" />
              Прочитать все
            </Button>
          )}
        </div>
        <Separator />

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <WarehouseSelector
            value={warehouseId}
            onChange={setWarehouseId}
            showAll
            placeholder="Выберите склад"
          />
          <Select value={alertType} onValueChange={setAlertType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              {alertTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!warehouseId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <IconBell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Выберите склад</h3>
              <p className="text-muted-foreground mt-1">
                Выберите склад для просмотра уведомлений
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Нет в наличии</CardDescription>
                  <CardTitle className="text-2xl text-destructive">
                    {alertSummary.outOfStock}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Низкий остаток</CardDescription>
                  <CardTitle className="text-2xl text-yellow-500">
                    {alertSummary.lowStock}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Избыточный запас</CardDescription>
                  <CardTitle className="text-2xl text-blue-500">
                    {alertSummary.overstock}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Истекает срок</CardDescription>
                  <CardTitle className="text-2xl text-yellow-500">
                    {alertSummary.expiring}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Alerts List */}
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : !alerts?.length ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <IconChecks className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">Все в порядке</h3>
                  <p className="text-muted-foreground mt-1">
                    Нет активных уведомлений для выбранного склада
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Critical Alerts */}
                {alerts.filter((a) => a.alertType === 'OUT_OF_STOCK').length > 0 && (
                  <Card className="border-destructive/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 text-destructive">
                        <IconPackageOff className="h-4 w-4" />
                        Критические ({alerts.filter((a) => a.alertType === 'OUT_OF_STOCK').length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {alerts
                        .filter((a) => a.alertType === 'OUT_OF_STOCK')
                        .map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-3"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {getAlertIcon(alert.alertType)}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{alert.item?.name}</p>
                                  <Badge variant={getAlertBadgeVariant(alert.alertType)}>
                                    {ALERT_TYPE_LABELS[alert.alertType as AlertType] ||
                                      alert.alertType}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {alert.warehouse?.name} • Текущий:{' '}
                                  <span
                                    className={
                                      alert.currentValue <= 0 ? 'text-destructive font-medium' : ''
                                    }
                                  >
                                    {alert.currentValue}
                                  </span>
                                  , Минимум: {alert.threshold}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  href={`/dashboard/inventory/purchase-orders?itemId=${alert.itemId}`}
                                >
                                  Заказать
                                </Link>
                              </Button>
                              {!alert.isAcknowledged && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleAcknowledge(alert.id)}
                                  disabled={isAcknowledging}
                                  title="Подтвердить"
                                >
                                  <IconCheck className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}

                {/* Warning Alerts */}
                {alerts.filter(
                  (a) =>
                    a.alertType === 'LOW_STOCK' ||
                    a.alertType === 'EXPIRING_SOON' ||
                    a.alertType === 'OVERSTOCK'
                ).length > 0 && (
                  <Card className="border-yellow-500/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 text-yellow-600">
                        <IconAlertTriangle className="h-4 w-4" />
                        Предупреждения (
                        {
                          alerts.filter(
                            (a) =>
                              a.alertType === 'LOW_STOCK' ||
                              a.alertType === 'EXPIRING_SOON' ||
                              a.alertType === 'OVERSTOCK'
                          ).length
                        }
                        )
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {alerts
                        .filter(
                          (a) =>
                            a.alertType === 'LOW_STOCK' ||
                            a.alertType === 'EXPIRING_SOON' ||
                            a.alertType === 'OVERSTOCK'
                        )
                        .map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {getAlertIcon(alert.alertType)}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{alert.item?.name}</p>
                                  <Badge variant={getAlertBadgeVariant(alert.alertType)}>
                                    {ALERT_TYPE_LABELS[alert.alertType as AlertType] ||
                                      alert.alertType}
                                  </Badge>
                                  {alert.isAcknowledged && (
                                    <Badge variant="secondary">Прочитано</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {alert.warehouse?.name} • Текущий: {alert.currentValue},
                                  Минимум: {alert.threshold}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/inventory/stock?itemId=${alert.itemId}`}>
                                  Остатки
                                </Link>
                              </Button>
                              {!alert.isAcknowledged && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleAcknowledge(alert.id)}
                                  disabled={isAcknowledging}
                                  title="Подтвердить"
                                >
                                  <IconCheck className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  )
}
