'use client'

import { useState } from 'react'
import Link from 'next/link'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

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
  useGetProductionOrders,
  ProductionStatusBadge,
  PRODUCTION_STATUS_LABELS,
  type ProductionStatus,
} from '@/entities/production-order'
import { CreateProductionDialog } from '@/features/production-order-form'

export default function ProductionPage() {
  const [status, setStatus] = useState<ProductionStatus | ''>('')

  const { data: orders, isLoading } = useGetProductionOrders({
    status: status || undefined,
  })

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Производство"
            description="Заказы на производство полуфабрикатов"
          />
          <CreateProductionDialog />
        </div>
        <Separator />

        <div className="flex flex-wrap gap-4">
          <Select
            value={status || 'all'}
            onValueChange={(val) => setStatus(val === 'all' ? '' : (val as ProductionStatus))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Все статусы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {Object.entries(PRODUCTION_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  <TableHead>Склад</TableHead>
                  <TableHead>Продукт</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>План. дата</TableHead>
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
                      <TableCell className="font-medium">{order.productionNumber}</TableCell>
                      <TableCell>{order.warehouseName}</TableCell>
                      <TableCell>{order.outputItemName}</TableCell>
                      <TableCell>
                        {order.actualQuantity ?? order.plannedQuantity} {order.outputUnit}
                      </TableCell>
                      <TableCell>
                        <ProductionStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(order.plannedDate), 'dd MMM yyyy', { locale: ru })}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/inventory/production/${order.id}`}>
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
