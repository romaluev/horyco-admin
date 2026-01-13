'use client'

import { useState } from 'react'

import { IconSearch } from '@tabler/icons-react'

import { Heading } from '@/shared/ui/base/heading'
import { Input } from '@/shared/ui/base/input'
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
import PageContainer from '@/shared/ui/layout/page-container'

import { useGetStock, StockLevelIndicator } from '@/entities/stock'
import { useGetWarehouses } from '@/entities/warehouse'
import { AdjustStockDialog } from '@/features/stock-adjustment'

export default function StockPage() {
  const [search, setSearch] = useState('')
  const [warehouseId, setWarehouseId] = useState<number | undefined>()
  const [filter, setFilter] = useState<string>('all')

  const { data: warehouses } = useGetWarehouses()
  const { data: stockData, isLoading } = useGetStock({
    search: search || undefined,
    warehouseId,
  })

  const stockItems = stockData?.data ?? []

  const filteredStock = stockItems.filter((stock) => {
    if (filter === 'low') {
      return stock.item?.minStockLevel && stock.quantity < stock.item.minStockLevel
    }
    if (filter === 'out') {
      return stock.quantity <= 0
    }
    return true
  })

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Остатки"
            description="Текущие остатки товаров на складах"
          />
          <AdjustStockDialog />
        </div>
        <Separator />

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск товара..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={warehouseId ? String(warehouseId) : 'all'}
            onValueChange={(value) =>
              setWarehouseId(value === 'all' ? undefined : Number(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Все склады" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все склады</SelectItem>
              {warehouses?.map((warehouse) => (
                <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все товары</SelectItem>
              <SelectItem value="low">Мало на складе</SelectItem>
              <SelectItem value="out">Нет в наличии</SelectItem>
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
                  <TableHead>Товар</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Склад</TableHead>
                  <TableHead className="text-right">Количество</TableHead>
                  <TableHead className="text-right">Резерв</TableHead>
                  <TableHead className="text-right">Доступно</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Ср. себестоимость</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!warehouseId ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Выберите склад для просмотра остатков
                    </TableCell>
                  </TableRow>
                ) : filteredStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Остатки не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStock.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        {stock.item?.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {stock.item?.sku || '—'}
                      </TableCell>
                      <TableCell>{stock.warehouse?.name}</TableCell>
                      <TableCell className="text-right">
                        {stock.quantity} {stock.item?.unit}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {stock.reservedQuantity}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {stock.quantity - stock.reservedQuantity}
                      </TableCell>
                      <TableCell>
                        <StockLevelIndicator
                          quantity={stock.quantity}
                          minLevel={stock.item?.minStockLevel}
                          maxLevel={stock.item?.maxStockLevel}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('ru-RU', {
                          style: 'currency',
                          currency: 'UZS',
                          maximumFractionDigits: 0,
                        }).format(stock.averageCost)}
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
