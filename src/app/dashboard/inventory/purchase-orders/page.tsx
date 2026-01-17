'use client'

import { useState } from 'react'
import Link from 'next/link'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { formatCurrency } from '@/shared/lib/format'
import { Heading } from '@/shared/ui/base/heading'
import { Separator } from '@/shared/ui/base/separator'
import { Skeleton } from '@/shared/ui/base/skeleton'
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
import { Button } from '@/shared/ui/base/button'
import PageContainer from '@/shared/ui/layout/page-container'

import {
  useGetPurchaseOrders,
  POStatusBadge,
  PO_STATUS_LABELS,
  type POStatus,
} from '@/entities/purchase-order'
import { SupplierSelector } from '@/entities/supplier'
import { CreatePODialog } from '@/features/purchase-order-form'

export default function PurchaseOrdersPage() {
  const [status, setStatus] = useState<POStatus | ''>('')
  const [supplierId, setSupplierId] = useState<number | undefined>()

  const { data: orders, isLoading } = useGetPurchaseOrders({
    status: status || undefined,
    supplierId,
  })

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

        <div className="flex flex-wrap gap-4">
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

          <div className="w-[200px]">
            <SupplierSelector
              value={supplierId}
              onChange={setSupplierId}
              showAll
              placeholder="Все поставщики"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Поставщик</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата заказа</TableHead>
                  <TableHead>Ожидается</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!orders?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Заказы не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.poNumber}</TableCell>
                      <TableCell>{order.supplierName}</TableCell>
                      <TableCell>
                        <POStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(order.orderDate), 'dd MMM yyyy', { locale: ru })}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.expectedDate
                          ? format(new Date(order.expectedDate), 'dd MMM yyyy', { locale: ru })
                          : '—'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/inventory/purchase-orders/${order.id}`}>
                            Открыть
                          </Link>
                        </Button>
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
