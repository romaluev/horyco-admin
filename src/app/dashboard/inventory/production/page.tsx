'use client'

import { useState, useMemo } from 'react'

import { Link } from '@tanstack/react-router'

import { IconSearch, IconBoxMultiple } from '@tabler/icons-react'
import { format, startOfDay, endOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'

import { Button } from '@/shared/ui/base/button'
import { Card, CardContent } from '@/shared/ui/base/card'
import { DatePicker } from '@/shared/ui/base/date-picker'
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
  useGetProductionOrders,
  ProductionStatusBadge,
  PRODUCTION_STATUS_LABELS,
  type ProductionStatus,
} from '@/entities/inventory/production-order'
import { WarehouseSelector } from '@/entities/inventory/warehouse'
import { CreateProductionDialog } from '@/features/inventory/production-order-form'

export default function ProductionPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ProductionStatus | ''>('')
  const [warehouseId, setWarehouseId] = useState<number | undefined>()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const { data: orders, isLoading } = useGetProductionOrders({
    status: status || undefined,
    warehouseId,
    from: selectedDate ? format(startOfDay(selectedDate), 'yyyy-MM-dd') : undefined,
    to: selectedDate ? format(endOfDay(selectedDate), 'yyyy-MM-dd') : undefined,
  })

  // Filter by search
  const filteredOrders = orders?.filter((order) =>
    order.productionNumber.toLowerCase().includes(search.toLowerCase()) ||
    order.outputItemName.toLowerCase().includes(search.toLowerCase())
  )

  // Calculate summary
  const summary = useMemo(() => {
    if (!filteredOrders) return { planned: 0, inProgress: 0, completed: 0 }
    return filteredOrders.reduce(
      (acc, order) => {
        if (order.status === 'planned') acc.planned++
        if (order.status === 'in_progress') acc.inProgress++
        if (order.status === 'completed') acc.completed++
        return acc
      },
      { planned: 0, inProgress: 0, completed: 0 }
    )
  }, [filteredOrders])

  const hasFilters = Boolean(search || status || warehouseId)

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

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative min-w-[200px] flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по номеру или продукту..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

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

          <div className="w-[180px]">
            <WarehouseSelector
              value={warehouseId}
              onChange={setWarehouseId}
              showAll
              placeholder="Все склады"
            />
          </div>

          <div className="w-[180px]">
            <DatePicker
              value={selectedDate}
              onChange={(dateStr) => setSelectedDate(dateStr ? new Date(dateStr) : undefined)}
              placeholder="Выберите дату"
            />
          </div>
        </div>

        {/* Summary */}
        {filteredOrders && filteredOrders.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Запланировано</p>
                  <p className="text-xl font-bold">{summary.planned}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">В процессе</p>
                  <p className="text-xl font-bold text-yellow-600">{summary.inProgress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Завершено</p>
                  <p className="text-xl font-bold text-emerald-600">{summary.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !filteredOrders?.length ? (
          <EmptyProductionState hasFilters={hasFilters} />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер</TableHead>
                  <TableHead>Продукт</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>План. дата</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.productionNumber}</TableCell>
                    <TableCell>{order.outputItemName}</TableCell>
                    <TableCell>
                      {order.actualQuantity ?? order.plannedQuantity} {order.outputUnit}
                    </TableCell>
                    <TableCell>
                      <ProductionStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(order.plannedDate), 'd MMM', { locale: ru })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/dashboard/inventory/production/${order.id}` as any}>
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

const EmptyProductionState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
    <IconBoxMultiple className="h-12 w-12 text-muted-foreground/50" />
    <h3 className="mt-4 text-lg font-semibold">
      {hasFilters ? 'Заказы не найдены' : 'Нет заказов на производство'}
    </h3>
    <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
      {hasFilters
        ? 'Попробуйте изменить параметры поиска или фильтры.'
        : 'Создайте заказ на производство полуфабрикатов по техкартам.'}
    </p>
    {!hasFilters && (
      <div className="mt-6">
        <CreateProductionDialog />
      </div>
    )}
  </div>
)
