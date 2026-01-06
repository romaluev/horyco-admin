/**
 * Stock Levels Page
 * Page for viewing current stock levels by warehouse
 */

'use client'

import { useState, useEffect } from 'react'

import { IconSearch, IconDownload } from '@tabler/icons-react'

import PageContainer from '@/shared/ui/layout/page-container'
import { Input } from '@/shared/ui/base/input'
import { Button } from '@/shared/ui/base/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import { Badge } from '@/shared/ui/base/badge'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useBranchStore } from '@/entities/branch'
import { useGetWarehouses, WarehouseSelector } from '@/entities/warehouse'
import { useGetStock, StockLevelIndicator } from '@/entities/stock'
import { StockSummaryCards } from '@/widgets/inventory-dashboard'
import { AdjustStockDialog } from '@/features/stock-adjustment'
import { UNIT_LABELS, type InventoryUnit } from '@/shared/types/inventory'

export default function StockPage() {
  const { selectedBranchId } = useBranchStore()
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)
  const [search, setSearch] = useState('')

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

  const { data, isLoading } = useGetStock(
    { warehouseId: selectedWarehouse || 0, search: search || undefined },
    { enabled: !!selectedBranchId && !!selectedWarehouse }
  )

  const stocks = data || []

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
            <h1 className="text-2xl font-bold tracking-tight">Остатки</h1>
            <p className="text-muted-foreground">
              Текущие остатки товаров на складах
            </p>
          </div>
          <div className="flex gap-2">
            <AdjustStockDialog
              branchId={selectedBranchId}
              warehouseId={selectedWarehouse || 0}
            />
            <Button variant="outline">
              <IconDownload className="mr-2 h-4 w-4" />
              Экспорт
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <StockSummaryCards
          warehouseId={selectedWarehouse || undefined}
        />

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full sm:w-64">
            <WarehouseSelector
              branchId={selectedBranchId}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Выберите склад"
            />
          </div>
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск товара..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              disabled={!selectedWarehouse}
            />
          </div>
        </div>

        {/* Table */}
        {!selectedWarehouse ? (
          <div className="flex h-[300px] items-center justify-center rounded-md border">
            <p className="text-muted-foreground">
              Выберите склад для просмотра остатков
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead>Артикул</TableHead>
                  <TableHead>Остаток</TableHead>
                  <TableHead>Мин. остаток</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Стоимость</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : stocks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">
                        {search ? 'Товары не найдены' : 'Нет товаров на складе'}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  stocks.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        {stock.inventoryItemName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {stock.inventoryItemSku || '—'}
                      </TableCell>
                      <TableCell>
                        {stock.quantity} {UNIT_LABELS[stock.unit as InventoryUnit] || stock.unit}
                      </TableCell>
                      <TableCell>
                        {stock.minStock
                          ? `${stock.minStock} ${UNIT_LABELS[stock.unit as InventoryUnit] || stock.unit}`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <StockLevelIndicator
                          quantity={stock.quantity}
                          minStockLevel={stock.minStock}
                        />
                      </TableCell>
                      <TableCell>
                        {(stock.quantity * stock.avgCost).toLocaleString()} сум
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
