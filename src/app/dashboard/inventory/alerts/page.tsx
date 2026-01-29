'use client'

import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import {
  IconBell,
  IconCheck,
  IconAlertTriangle,
  IconPackageOff,
  IconChecks,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import {
  ALERT_TYPE_LABELS,
  ALERT_TYPE_COLORS,
  type AlertType,
} from '@/shared/types/inventory'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
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

import {
  useStockAlerts,
  useAcknowledgeAlert,
  useAcknowledgeAllAlerts,
} from '@/entities/inventory/stock'
import { WarehouseSelector } from '@/entities/inventory/warehouse'

function getAlertTypeOptions(t: any) {
  return [
    { value: 'all', label: t('pages.alerts.allTypes') },
    { value: 'OUT_OF_STOCK', label: t('pages.alerts.outOfStock') },
    { value: 'LOW_STOCK', label: t('pages.alerts.lowStock') },
    { value: 'OVERSTOCK', label: t('pages.alerts.overstock') },
    { value: 'EXPIRING_SOON', label: t('pages.alerts.expiringKoon') },
  ]
}

function getStatusOptions(t: any) {
  return [
    { value: 'unacknowledged', label: t('pages.alerts.unread') },
    { value: 'acknowledged', label: t('pages.alerts.read') },
    { value: 'all', label: t('pages.alerts.all') },
  ]
}

function getAlertIcon(alertType: string) {
  if (alertType === 'OUT_OF_STOCK') {
    return <IconPackageOff className="text-destructive h-5 w-5" />
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
  const { t } = useTranslation('inventory')
  const [warehouseId, setWarehouseId] = useState<number | undefined>()
  const [alertType, setAlertType] = useState<string>('all')
  const [status, setStatus] = useState<string>('unacknowledged')

  const { data: alerts, isLoading } = useStockAlerts({
    warehouseId,
    alertType: alertType !== 'all' ? alertType : undefined,
    isAcknowledged: status === 'all' ? undefined : status === 'acknowledged',
  })

  const { mutate: acknowledgeAlert, isPending: isAcknowledging } =
    useAcknowledgeAlert()
  const { mutate: acknowledgeAllAlerts, isPending: isAcknowledgingAll } =
    useAcknowledgeAllAlerts()

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
    outOfStock:
      alerts?.filter((a) => a.alertType === 'OUT_OF_STOCK').length || 0,
    lowStock: alerts?.filter((a) => a.alertType === 'LOW_STOCK').length || 0,
    overstock: alerts?.filter((a) => a.alertType === 'OVERSTOCK').length || 0,
    expiring:
      alerts?.filter((a) => a.alertType === 'EXPIRING_SOON').length || 0,
  }

  const alertTypeOptions = getAlertTypeOptions(t)
  const statusOptions = getStatusOptions(t)

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={t('pages.alerts.title')}
            description={t('pages.alerts.description')}
          />
          {warehouseId && hasUnacknowledged && (
            <Button
              variant="outline"
              onClick={handleAcknowledgeAll}
              disabled={isAcknowledgingAll}
            >
              <IconChecks className="mr-2 h-4 w-4" />
              {t('pages.alerts.markAllAsRead')}
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
            placeholder={t('pages.alerts.selectWarehouse')}
          />
          <Select value={alertType} onValueChange={setAlertType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('pages.alerts.selectType')} />
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
              <SelectValue placeholder={t('pages.alerts.selectStatus')} />
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
              <IconBell className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="text-lg font-medium">
                {t('pages.alerts.selectWarehouse')}
              </h3>
              <p className="text-muted-foreground mt-1">
                {t('pages.alerts.selectWarehouseMessage')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>
                    {t('pages.alerts.outOfStockCount')}
                  </CardDescription>
                  <CardTitle className="text-destructive text-2xl">
                    {alertSummary.outOfStock}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>
                    {t('pages.alerts.lowStockCount')}
                  </CardDescription>
                  <CardTitle className="text-2xl text-yellow-500">
                    {alertSummary.lowStock}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>
                    {t('pages.alerts.overstockCount')}
                  </CardDescription>
                  <CardTitle className="text-2xl text-blue-500">
                    {alertSummary.overstock}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>
                    {t('pages.alerts.expiringCount')}
                  </CardDescription>
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
                  <IconChecks className="mb-4 h-12 w-12 text-green-500" />
                  <h3 className="text-lg font-medium">
                    {t('pages.alerts.everythingOk')}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {t('pages.alerts.noNotifications')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {/* Critical Alerts */}
                {alerts.filter((a) => a.alertType === 'OUT_OF_STOCK').length >
                  0 && (
                  <Card className="border-destructive/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-destructive flex items-center gap-2 text-base">
                        <IconPackageOff className="h-4 w-4" />
                        {t('pages.alerts.critical')} (
                        {
                          alerts.filter((a) => a.alertType === 'OUT_OF_STOCK')
                            .length
                        }
                        )
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {alerts
                        .filter((a) => a.alertType === 'OUT_OF_STOCK')
                        .map((alert) => (
                          <div
                            key={alert.id}
                            className="border-destructive/30 bg-destructive/5 flex items-center justify-between rounded-lg border p-3"
                          >
                            <div className="flex flex-1 items-center gap-3">
                              {getAlertIcon(alert.alertType)}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">
                                    {alert.item?.name}
                                  </p>
                                  <Badge
                                    variant={getAlertBadgeVariant(
                                      alert.alertType
                                    )}
                                  >
                                    {ALERT_TYPE_LABELS[
                                      alert.alertType as AlertType
                                    ] || alert.alertType}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  {alert.warehouse?.name} •{' '}
                                  {t('pages.alerts.current')}{' '}
                                  <span
                                    className={
                                      alert.currentValue <= 0
                                        ? 'text-destructive font-medium'
                                        : ''
                                    }
                                  >
                                    {alert.currentValue}
                                  </span>
                                  , {t('pages.alerts.minimum')}:{' '}
                                  {alert.threshold}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  to={
                                    `/dashboard/inventory/purchase-orders?itemId=${alert.itemId}` as any
                                  }
                                >
                                  {t('pages.alerts.order')}
                                </Link>
                              </Button>
                              {!alert.isAcknowledged && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleAcknowledge(alert.id)}
                                  disabled={isAcknowledging}
                                  title={t('pages.alerts.confirm')}
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
                      <CardTitle className="flex items-center gap-2 text-base text-yellow-600">
                        <IconAlertTriangle className="h-4 w-4" />
                        {t('pages.alerts.warnings')} (
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
                            <div className="flex flex-1 items-center gap-3">
                              {getAlertIcon(alert.alertType)}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">
                                    {alert.item?.name}
                                  </p>
                                  <Badge
                                    variant={getAlertBadgeVariant(
                                      alert.alertType
                                    )}
                                  >
                                    {ALERT_TYPE_LABELS[
                                      alert.alertType as AlertType
                                    ] || alert.alertType}
                                  </Badge>
                                  {alert.isAcknowledged && (
                                    <Badge variant="secondary">
                                      {t('pages.alerts.read')}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  {alert.warehouse?.name} •{' '}
                                  {t('pages.alerts.current')}:{' '}
                                  {alert.currentValue},
                                  {t('pages.alerts.minimum')}: {alert.threshold}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  to={
                                    `/dashboard/inventory/stock?itemId=${alert.itemId}` as any
                                  }
                                >
                                  {t('pages.alerts.stock')}
                                </Link>
                              </Button>
                              {!alert.isAcknowledged && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleAcknowledge(alert.id)}
                                  disabled={isAcknowledging}
                                  title={t('pages.alerts.confirm')}
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
