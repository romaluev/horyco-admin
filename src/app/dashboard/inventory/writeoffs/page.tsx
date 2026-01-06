/**
 * Writeoffs Page
 * Page for managing inventory writeoffs
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
  useGetWriteoffs,
  WriteoffStatusBadge,
  WriteoffReasonBadge,
} from '@/entities/writeoff'
import { CreateWriteoffDialog } from '@/features/writeoff-form'
import {
  WriteoffStatus,
  WriteoffReason,
  WRITEOFF_STATUS_LABELS,
  WRITEOFF_REASON_LABELS,
} from '@/shared/types/inventory'

export default function WriteoffsPage() {
  const { selectedBranchId } = useBranchStore()
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [reasonFilter, setReasonFilter] = useState<string>('all')

  const { data, isLoading } = useGetWriteoffs(
    selectedBranchId || 0,
    {
      warehouseId: selectedWarehouse || undefined,
      status: statusFilter !== 'all' ? (statusFilter as WriteoffStatus) : undefined,
      reason: reasonFilter !== 'all' ? (reasonFilter as WriteoffReason) : undefined,
    },
    !!selectedBranchId
  )

  const writeoffs = data?.data || []

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
            <h1 className="text-2xl font-bold tracking-tight">Списания</h1>
            <p className="text-muted-foreground">
              Учёт списаний и потерь
            </p>
          </div>
          <CreateWriteoffDialog branchId={selectedBranchId} />
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
              {Object.values(WriteoffStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {WRITEOFF_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Причина" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все причины</SelectItem>
              {Object.values(WriteoffReason).map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {WRITEOFF_REASON_LABELS[reason]}
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
                <TableHead>Склад</TableHead>
                <TableHead>Причина</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Позиций</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Создал</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : writeoffs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">
                      Списания не найдены
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                writeoffs.map((writeoff) => (
                  <TableRow key={writeoff.id}>
                    <TableCell className="font-medium">#{writeoff.id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(writeoff.createdAt), 'dd.MM.yyyy', {
                        locale: ru,
                      })}
                    </TableCell>
                    <TableCell>{writeoff.warehouseName}</TableCell>
                    <TableCell>
                      <WriteoffReasonBadge reason={writeoff.reason} />
                    </TableCell>
                    <TableCell>
                      <WriteoffStatusBadge status={writeoff.status} />
                    </TableCell>
                    <TableCell>{writeoff.totalItems}</TableCell>
                    <TableCell>{(writeoff.totalCost ?? 0).toLocaleString()} сум</TableCell>
                    <TableCell className="text-muted-foreground">
                      {writeoff.createdByName}
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
