'use client'

import { useState } from 'react'

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
import PageContainer from '@/shared/ui/layout/page-container'
import { MOVEMENT_TYPE_LABELS, type MovementType } from '@/shared/types/inventory'

import { useGetMovements, MovementTypeBadge } from '@/entities/stock-movement'
import { useGetWarehouses } from '@/entities/warehouse'

export default function MovementsPage() {
  const [warehouseId, setWarehouseId] = useState<number | undefined>()
  const [movementType, setMovementType] = useState<MovementType | ''>('')

  const { data: warehouses } = useGetWarehouses()
  const { data: movementsData, isLoading } = useGetMovements({
    warehouseId,
    type: movementType || undefined,
  })

  const movements = movementsData?.data ?? []

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Движения товаров"
            description="История всех операций с товарами на складах"
          />
        </div>
        <Separator />

        <div className="flex flex-wrap gap-4">
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
          <Select value={movementType} onValueChange={(val) => setMovementType(val === 'all' ? '' : val as MovementType)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Все типы операций" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы операций</SelectItem>
              {Object.entries(MOVEMENT_TYPE_LABELS).map(([value, label]) => (
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
                  <TableHead>Дата</TableHead>
                  <TableHead>Товар</TableHead>
                  <TableHead>Склад</TableHead>
                  <TableHead>Тип операции</TableHead>
                  <TableHead className="text-right">Количество</TableHead>
                  <TableHead className="text-right">До</TableHead>
                  <TableHead className="text-right">После</TableHead>
                  <TableHead>Документ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!warehouseId ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Выберите склад для просмотра движений
                    </TableCell>
                  </TableRow>
                ) : movements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Движения не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(movement.createdAt), 'dd MMM yyyy HH:mm', {
                          locale: ru,
                        })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {movement.item?.name}
                      </TableCell>
                      <TableCell>{movement.warehouse?.name}</TableCell>
                      <TableCell>
                        <MovementTypeBadge type={movement.type} />
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          movement.quantity > 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-destructive'
                        }`}
                      >
                        {movement.quantity > 0 ? '+' : ''}
                        {movement.quantity} {movement.item?.unit}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {movement.previousQuantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {movement.newQuantity}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {movement.referenceNumber || '—'}
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
