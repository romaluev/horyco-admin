'use client'

import { useEffect, useState } from 'react'

import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useRouter, useSearchParams } from '@/shared/lib/navigation'
import { Button } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Separator } from '@/shared/ui/base/separator'
import PageContainer from '@/shared/ui/layout/page-container'

import { useStockSummary } from '@/entities/inventory/stock'
import { useGetWarehouses } from '@/entities/inventory/warehouse'
import {
  EmptyInventoryState,
  InventoryStatsCards,
  LowStockItemsList,
  PendingApprovalsWidget,
  RecentMovementsWidget,
  UpcomingDeliveriesWidget,
} from '@/widgets/inventory-dashboard'

const AUTO_REFRESH_INTERVAL = 60000 // 60 seconds

export default function InventoryDashboardPage() {
  const { t } = useTranslation('inventory')
  const router = useRouter()
  const searchParams = useSearchParams()
  const warehouseIdParam = searchParams.get('warehouseId')

  const { data: warehouses, isLoading: isWarehousesLoading } =
    useGetWarehouses()

  // Auto-select default warehouse or first one
  const [selectedWarehouse, setSelectedWarehouse] = useState<
    number | undefined
  >(warehouseIdParam ? Number(warehouseIdParam) : undefined)

  // Track last refresh time
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Get stock summary to check if inventory is empty
  const { data: summary, refetch: refetchSummary } =
    useStockSummary(selectedWarehouse)

  // Auto-select default warehouse when warehouses load
  useEffect(() => {
    if (
      warehouses &&
      warehouses.length > 0 &&
      !selectedWarehouse &&
      !warehouseIdParam
    ) {
      // Find default warehouse (isDefault=true) or first active one
      const defaultWarehouse =
        warehouses.find((w) => w.isDefault) ||
        warehouses.find((w) => w.isActive) ||
        warehouses[0]
      if (defaultWarehouse) {
        setSelectedWarehouse(defaultWarehouse.id)
        router.replace(
          `/dashboard/inventory?warehouseId=${defaultWarehouse.id}`,
          {
            scroll: false,
          }
        )
      }
    }
  }, [warehouses, selectedWarehouse, warehouseIdParam, router])

  // Handle warehouse change
  const handleWarehouseChange = (value: string) => {
    const newWarehouseId = Number(value)
    setSelectedWarehouse(newWarehouseId)
    router.replace(`/dashboard/inventory?warehouseId=${newWarehouseId}`, {
      scroll: false,
    })
  }

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetchSummary()
    setLastRefresh(new Date())
    setIsRefreshing(false)
  }

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await refetchSummary()
      setLastRefresh(new Date())
    }, AUTO_REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [refetchSummary])

  const isEmptyInventory = summary?.totalItems === 0

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <Heading
            title={t('pages.dashboard.title')}
            description={t('pages.dashboard.description')}
          />
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>
                {t('pages.dashboard.updated')}{' '}
                {formatDistanceToNow(lastRefresh, {
                  addSuffix: true,
                  locale: ru,
                })}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
            <Select
              value={selectedWarehouse ? String(selectedWarehouse) : ''}
              onValueChange={handleWarehouseChange}
              disabled={isWarehousesLoading || !warehouses?.length}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue
                  placeholder={t('pages.dashboard.selectWarehouse')}
                />
              </SelectTrigger>
              <SelectContent>
                {warehouses?.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />

        {isEmptyInventory && selectedWarehouse ? (
          <EmptyInventoryState />
        ) : (
          <>
            <InventoryStatsCards warehouseId={selectedWarehouse} />

            <div className="grid gap-6 md:grid-cols-2">
              <LowStockItemsList warehouseId={selectedWarehouse} />
              <RecentMovementsWidget warehouseId={selectedWarehouse} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <PendingApprovalsWidget warehouseId={selectedWarehouse} />
              <UpcomingDeliveriesWidget warehouseId={selectedWarehouse} />
            </div>
          </>
        )}
      </div>
    </PageContainer>
  )
}
