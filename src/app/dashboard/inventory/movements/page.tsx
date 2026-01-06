/**
 * Stock Movements Page
 * Page for viewing stock movement history
 */

'use client'

import { useState, useEffect } from 'react'

import { IconSearch, IconDownload, IconCalendar } from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import PageContainer from '@/shared/ui/layout/page-container'
import { Input } from '@/shared/ui/base/input'
import { Button } from '@/shared/ui/base/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useBranchStore } from '@/entities/branch'
import { useGetWarehouses, WarehouseSelector } from '@/entities/warehouse'
import {
  useGetMovements,
  MovementTypeBadge,
  MovementQuantityBadge,
} from '@/entities/stock-movement'
import {
  MovementType,
  MOVEMENT_TYPE_LABELS,
  UNIT_LABELS,
  type InventoryUnit,
} from '@/shared/types/inventory'

export default function MovementsPage() {
  const { selectedBranchId } = useBranchStore()
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('all')

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

  const { data, isLoading } = useGetMovements({
    warehouseId: selectedWarehouse || undefined,
    movementType: typeFilter !== 'all' ? (typeFilter as MovementType) : undefined,
    limit: 50,
  })

  const movements = data || []

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
            <h1 className="text-2xl font-bold tracking-tight">Движения</h1>
            <p className="text-muted-foreground">
              История движения товаров на складах
            </p>
          </div>
          <Button variant="outline">
            <IconDownload className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full sm:w-64">
            <WarehouseSelector
              branchId={selectedBranchId}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Все склады"
              allowClear
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Тип операции" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              {Object.values(MovementType).map((type) => (
                <SelectItem key={type} value={type}>
                  {MOVEMENT_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Товар</TableHead>
                <TableHead>Склад</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Источник</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!selectedWarehouse ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      Выберите склад для просмотра движений
                    </p>
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      Движения не найдены
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(movement.createdAt), 'dd.MM.yyyy HH:mm', {
                        locale: ru,
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.inventoryItemName || movement.item?.name}
                    </TableCell>
                    <TableCell>{movement.warehouseName || movement.warehouse?.name}</TableCell>
                    <TableCell>
                      <MovementTypeBadge type={movement.movementType} />
                    </TableCell>
                    <TableCell>
                      <MovementQuantityBadge
                        quantity={movement.quantity}
                        unit={movement.unit || movement.item?.unit || ''}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {movement.reference || movement.referenceNumber || '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageContainer>
  )
}
