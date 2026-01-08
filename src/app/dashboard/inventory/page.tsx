/**
 * Inventory Dashboard Page
 * Main overview page for inventory management
 */

'use client'

import { useState, useEffect } from 'react'

import PageContainer from '@/shared/ui/layout/page-container'

import { useBranchStore } from '@/entities/branch'
import { useGetWarehouses, WarehouseSelector } from '@/entities/warehouse'

import {
  StockSummaryCards,
  LowStockItemsList,
  RecentMovementsWidget,
  PendingApprovalsWidget,
  UpcomingDeliveriesWidget,
} from '@/widgets/inventory-dashboard'

export default function InventoryDashboardPage() {
  const { selectedBranchId } = useBranchStore()
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)

  // Fetch warehouses to auto-select default
  const { data: warehousesData } = useGetWarehouses(
    { branchId: selectedBranchId!, isActive: true },
    { enabled: !!selectedBranchId }
  )

  // Filter warehouses by branchId and auto-select default or first
  useEffect(() => {
    if (warehousesData && warehousesData.length > 0 && !selectedWarehouse && selectedBranchId) {
      const branchWarehouses = warehousesData.filter(w => w.branchId === selectedBranchId)
      if (branchWarehouses.length > 0) {
        const defaultWarehouse = branchWarehouses.find(w => w.isDefault)
        const firstWarehouse = branchWarehouses[0]
        setSelectedWarehouse(defaultWarehouse?.id ?? firstWarehouse?.id ?? null)
      }
    }
  }, [warehousesData, selectedWarehouse, selectedBranchId])

  if (!selectedBranchId) {
    return (
      <PageContainer>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Выберите филиал</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Склад</h1>
            <p className="text-muted-foreground">
              Управление товарами, остатками и движениями
            </p>
          </div>
          <div className="w-full sm:w-64">
            <WarehouseSelector
              branchId={selectedBranchId}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Все склады"
              allowClear
            />
          </div>
        </div>

        {/* Stats Cards */}
        <StockSummaryCards
          warehouseId={selectedWarehouse || undefined}
        />

        {/* Widgets Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <LowStockItemsList
            warehouseId={selectedWarehouse || undefined}
          />
          <RecentMovementsWidget
            warehouseId={selectedWarehouse || undefined}
          />
          <PendingApprovalsWidget branchId={selectedBranchId} />
          <UpcomingDeliveriesWidget branchId={selectedBranchId} />
        </div>
      </div>
    </PageContainer>
  )
}
