/**
 * Purchase Orders Page
 * Page for managing purchase orders
 */

'use client'

import { useState } from 'react'

import Link from 'next/link'

import { IconSearch, IconEye } from '@tabler/icons-react'
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
import { useGetPurchaseOrders, POStatusBadge } from '@/entities/purchase-order'
import { CreatePODialog } from '@/features/purchase-order-form'
import { POStatus, PO_STATUS_LABELS } from '@/shared/types/inventory'

export default function PurchaseOrdersPage() {
  const { selectedBranchId } = useBranchStore()
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data, isLoading } = useGetPurchaseOrders(
    {
      branchId: selectedBranchId || undefined,
      status: statusFilter !== 'all' ? (statusFilter as POStatus) : undefined,
    },
    { enabled: !!selectedBranchId }
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
            <h1 className="text-2xl font-bold tracking-tight">Закупки</h1>
            <p className="text-muted-foreground">
              Заказы поставщикам и приёмка товаров
            </p>
          </div>
          <CreatePODialog branchId={selectedBranchId} />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {Object.values(POStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {PO_STATUS_LABELS[status]}
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
                <TableHead>Поставщик</TableHead>
                <TableHead>Склад</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Позиций</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead className="w-[80px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">
                      Заказы не найдены
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
                    <TableCell>{order.supplierName || order.supplier?.name}</TableCell>
                    <TableCell>{order.warehouseName || order.warehouse?.name}</TableCell>
                    <TableCell>
                      <POStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>{order.totalItems || order.items?.length || 0}</TableCell>
                    <TableCell>{(order.totalAmount || order.total || 0).toLocaleString()} сум</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/inventory/purchase-orders/${order.id}`}>
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
