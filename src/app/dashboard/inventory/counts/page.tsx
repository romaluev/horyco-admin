/**
 * Inventory Counts Page
 * Page for managing inventory counts (stocktaking)
 */

'use client'

import { useState } from 'react'

import Link from 'next/link'

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
  useGetInventoryCounts,
  CountStatusBadge,
  CountTypeBadge,
  CountProgressBar,
} from '@/entities/inventory-count'
import { CreateCountDialog } from '@/features/inventory-count-form'
import {
  CountStatus,
  CountType,
  COUNT_STATUS_LABELS,
  COUNT_TYPE_LABELS,
} from '@/shared/types/inventory'

export default function CountsPage() {
  const { selectedBranchId } = useBranchStore()
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const { data, isLoading } = useGetInventoryCounts(
    selectedBranchId || 0,
    {
      warehouseId: selectedWarehouse || undefined,
      status: statusFilter !== 'all' ? (statusFilter as CountStatus) : undefined,
      type: typeFilter !== 'all' ? (typeFilter as CountType) : undefined,
    },
    !!selectedBranchId
  )

  const counts = data?.data || []

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
            <h1 className="text-2xl font-bold tracking-tight">Инвентаризации</h1>
            <p className="text-muted-foreground">
              Подсчёт и сверка остатков
            </p>
          </div>
          <CreateCountDialog branchId={selectedBranchId} />
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
              {Object.values(CountStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {COUNT_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              {Object.values(CountType).map((type) => (
                <SelectItem key={type} value={type}>
                  {COUNT_TYPE_LABELS[type]}
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
                <TableHead>Название</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Склад</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Прогресс</TableHead>
                <TableHead>Расхождение</TableHead>
                <TableHead className="w-[80px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : counts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">
                      Инвентаризации не найдены
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                counts.map((count) => (
                  <TableRow key={count.id}>
                    <TableCell className="font-medium">{count.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(count.createdAt), 'dd.MM.yyyy', {
                        locale: ru,
                      })}
                    </TableCell>
                    <TableCell>{count.warehouseName}</TableCell>
                    <TableCell>
                      <CountTypeBadge type={count.type} />
                    </TableCell>
                    <TableCell>
                      <CountStatusBadge status={count.status} />
                    </TableCell>
                    <TableCell className="w-40">
                      <CountProgressBar
                        totalItems={count.totalItems}
                        countedItems={count.countedItems}
                      />
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          count.totalVariance > 0
                            ? 'text-green-600'
                            : count.totalVariance < 0
                              ? 'text-red-600'
                              : ''
                        }
                      >
                        {count.totalVariance > 0 ? '+' : ''}
                        {count.totalVarianceCost.toLocaleString()} сум
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/inventory/counts/${count.id}`}>
                          <IconEye className="h-4 w-4" />
                        </Link>
                      </Button>
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
