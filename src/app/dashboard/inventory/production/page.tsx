/**
 * Production Orders Page
 * Page for managing production orders
 */

'use client'

import { useState } from 'react'

import { IconEye } from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import PageContainer from '@/shared/ui/layout/page-container'
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
import { WarehouseSelector } from '@/entities/warehouse'
import {
  useGetProductionOrders,
  ProductionStatusBadge,
} from '@/entities/production-order'
import {
  CreateProductionDialog,
  StartProductionButton,
  CompleteProductionButton,
  CancelProductionButton,
  DeleteProductionButton,
} from '@/features/production-order-form'
import {
  ProductionStatus,
  PRODUCTION_STATUS_LABELS,
  UNIT_LABELS,
  type InventoryUnit,
} from '@/shared/types/inventory'

export default function ProductionPage() {
  const { selectedBranchId } = useBranchStore()
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data, isLoading } = useGetProductionOrders(
    selectedBranchId || 0,
    {
      warehouseId: selectedWarehouse || undefined,
      status: statusFilter !== 'all' ? (statusFilter as ProductionStatus) : undefined,
    },
    !!selectedBranchId
  )

  const orders = data?.data || []

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
            <h1 className="text-2xl font-bold tracking-tight">Производство</h1>
            <p className="text-muted-foreground">
              Заказы на производство полуфабрикатов
            </p>
          </div>
          <CreateProductionDialog branchId={selectedBranchId} />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full sm:w-48">
            <WarehouseSelector
              branchId={selectedBranchId}
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              placeholder="Все склады"
              allowClear
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {Object.values(ProductionStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {PRODUCTION_STATUS_LABELS[status]}
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
                <TableHead>№</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Техкарта</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Склад</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Себестоимость</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">
                      Заказы на производство не найдены
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(order.createdAt), 'dd.MM.yyyy', {
                        locale: ru,
                      })}
                    </TableCell>
                    <TableCell>{order.recipeName}</TableCell>
                    <TableCell>
                      {order.quantity}{' '}
                      {UNIT_LABELS[order.unit as InventoryUnit] || order.unit}
                    </TableCell>
                    <TableCell>{order.warehouseName}</TableCell>
                    <TableCell>
                      <ProductionStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      {(order.actualCost || order.estimatedCost).toLocaleString()} сум
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {order.status === ProductionStatus.PLANNED && (
                          <>
                            <StartProductionButton productionId={order.id} />
                            <DeleteProductionButton
                              productionId={order.id}
                              recipeName={order.recipeName}
                            />
                          </>
                        )}
                        {order.status === ProductionStatus.IN_PROGRESS && (
                          <>
                            <CompleteProductionButton productionId={order.id} />
                            <CancelProductionButton productionId={order.id} />
                          </>
                        )}
                      </div>
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
