import { useEffect, useState } from 'react'

import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { RefreshCw } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

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

export const Route = createFileRoute('/dashboard/_layout/inventory/')({
  validateSearch: (search: Record<string, unknown>) => ({
    warehouseId: search.warehouseId ? Number(search.warehouseId) : undefined,
  }),
  component: InventoryDashboardPage,
})

const AUTO_REFRESH_INTERVAL = 60000

function InventoryDashboardPage() {
  const navigate = useNavigate()
  const { warehouseId: warehouseIdParam } = Route.useSearch()

  const { data: warehouses, isLoading: isWarehousesLoading } = useGetWarehouses()

  const [selectedWarehouse, setSelectedWarehouse] = useState<number | undefined>(
    warehouseIdParam
  )
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: summary, refetch: refetchSummary } = useStockSummary(selectedWarehouse)

  useEffect(() => {
    if (warehouses && warehouses.length > 0 && !selectedWarehouse && !warehouseIdParam) {
      const defaultWarehouse =
        warehouses.find((w) => w.isDefault) ||
        warehouses.find((w) => w.isActive) ||
        warehouses[0]
      if (defaultWarehouse) {
        setSelectedWarehouse(defaultWarehouse.id)
        navigate({
          to: '/dashboard/inventory',
          search: { warehouseId: defaultWarehouse.id },
          replace: true,
        })
      }
    }
  }, [warehouses, selectedWarehouse, warehouseIdParam, navigate])

  const handleWarehouseChange = (value: string) => {
    const newWarehouseId = Number(value)
    setSelectedWarehouse(newWarehouseId)
    navigate({
      to: '/dashboard/inventory',
      search: { warehouseId: newWarehouseId },
      replace: true,
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetchSummary()
    setLastRefresh(new Date())
    setIsRefreshing(false)
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await refetchSummary()
      setLastRefresh(new Date())
    }, AUTO_REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [refetchSummary])

  const isEmptyInventory = summary?.totalItems === 0

  return (
    <>
      <Helmet>
        <title>Склад | Horyco Admin</title>
      </Helmet>
      <PageContainer scrollable>
        <div className="flex flex-1 flex-col space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <Heading
              title="Управление складом"
              description="Контроль остатков, движений и уведомлений"
            />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  Обновлено{' '}
                  {formatDistanceToNow(lastRefresh, { addSuffix: true, locale: ru })}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <Select
                value={selectedWarehouse ? String(selectedWarehouse) : ''}
                onValueChange={handleWarehouseChange}
                disabled={isWarehousesLoading || !warehouses?.length}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Выберите склад" />
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
    </>
  )
}
