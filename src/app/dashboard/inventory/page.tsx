'use client'

import { useState } from 'react'

import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetWarehouses } from '@/entities/warehouse'

import {
  InventoryStatsCards,
  LowStockItemsList,
  RecentMovementsWidget,
  StockAlertsWidget,
} from '@/widgets/inventory-dashboard'

export default function InventoryDashboardPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | undefined>()
  const { data: warehouses } = useGetWarehouses()

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-6">
        <div className="flex items-start justify-between">
          <Heading
            title="Управление складом"
            description="Контроль остатков, движений и уведомлений"
          />
          <Select
            value={selectedWarehouse ? String(selectedWarehouse) : 'all'}
            onValueChange={(value) =>
              setSelectedWarehouse(value === 'all' ? undefined : Number(value))
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Все склады" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все склады</SelectItem>
              {warehouses?.map((warehouse) => (
                <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator />

        <InventoryStatsCards warehouseId={selectedWarehouse} />

        <div className="grid gap-6 md:grid-cols-2">
          <LowStockItemsList warehouseId={selectedWarehouse} />
          <StockAlertsWidget warehouseId={selectedWarehouse} />
        </div>

        <RecentMovementsWidget warehouseId={selectedWarehouse} />
      </div>
    </PageContainer>
  )
}
