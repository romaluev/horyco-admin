'use client'

import { useState } from 'react'

import Link from 'next/link'

import { IconSearch, IconClipboardList } from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { formatCurrency } from '@/shared/lib/format'
import { Button } from '@/shared/ui/base/button'
import { Heading } from '@/shared/ui/base/heading'
import { Input } from '@/shared/ui/base/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Separator } from '@/shared/ui/base/separator'
import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useGetPurchaseOrders,
  POStatusBadge,
  PO_STATUS_LABELS,
  type POStatus,
} from '@/entities/purchase-order'
import { SupplierSelector } from '@/entities/supplier'
import { WarehouseSelector } from '@/entities/warehouse'
import { CreatePODialog } from '@/features/purchase-order-form'

export default function PurchaseOrdersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<POStatus | ''>('')
  const [supplierId, setSupplierId] = useState<number | undefined>()
  const [warehouseId, setWarehouseId] = useState<number | undefined>()

  const { data: orders, isLoading } = useGetPurchaseOrders({
    status: status || undefined,
    supplierId,
    warehouseId,
  })

  // Filter by PO number search
  const filteredOrders = orders?.filter((order) =>
    order.poNumber.toLowerCase().includes(search.toLowerCase())
  )

  const hasFilters = Boolean(search || status || supplierId || warehouseId)

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Заказы поставщикам"
            description="Управление закупками и приёмом товаров"
          />
          <CreatePODialog />
        </div>
        <Separator />

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-[200px] flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по номеру..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="w-[200px]">
            <SupplierSelector
              value={supplierId}
              onChange={setSupplierId}
              showAll
              placeholder="Все поставщики"
            />
          </div>

          <Select
            value={status || 'all'}
            onValueChange={(val) => setStatus(val === 'all' ? '' : (val as POStatus))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {Object.entries(PO_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-[180px]">
            <WarehouseSelector
              value={warehouseId}
              onChange={setWarehouseId}
              showAll
              placeholder="Все склады"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !filteredOrders?.length ? (
          <EmptyPurchaseOrdersState hasFilters={hasFilters} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Поставщик</TableHead>
                  <TableHead>Склад</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Ожидается</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.poNumber}</TableCell>
                    <TableCell>{order.supplierName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.warehouseName}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.expectedDate
                        ? format(new Date(order.expectedDate), 'd MMM', { locale: ru })
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <POStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/inventory/purchase-orders/${order.id}`}>
                          Открыть
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

const EmptyPurchaseOrdersState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
    <IconClipboardList className="h-12 w-12 text-muted-foreground/50" />
    <h3 className="mt-4 text-lg font-semibold">
      {hasFilters ? 'Заказы не найдены' : 'Нет заказов'}
    </h3>
    <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
      {hasFilters
        ? 'Попробуйте изменить параметры поиска или фильтры.'
        : 'Создайте заказ поставщику для пополнения склада.'}
    </p>
    {!hasFilters && (
      <div className="mt-6">
        <CreatePODialog />
      </div>
    )}
  </div>
)
