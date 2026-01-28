'use client'

import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import { ChevronDown, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { formatPrice } from '@/shared/lib/format'
import { Button } from '@/shared/ui/base/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/base/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import { StockLevelIndicator } from '@/entities/inventory/stock'

import type { IStock } from '@/entities/inventory/stock'

interface IStockTableProps {
  items: IStock[]
}

export const StockTable = ({ items }: IStockTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]" />
            <TableHead>Товар</TableHead>
            <TableHead className="text-right">Доступно</TableHead>
            <TableHead className="text-right">Резерв</TableHead>
            <TableHead className="text-right">Ср. себест.</TableHead>
            <TableHead className="text-right">Общая стоим.</TableHead>
            <TableHead className="w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((stock) => {
            const available = stock.quantity - stock.reservedQuantity
            const totalValue = stock.quantity * stock.averageCost
            const isExpanded = expandedRows.has(stock.id)

            return (
              <Collapsible key={stock.id} open={isExpanded} asChild>
                <>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleRow(stock.id)}
                  >
                    <TableCell className="w-[40px]">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StockLevelIndicator
                          quantity={stock.quantity}
                          minLevel={stock.item?.minStockLevel}
                          maxLevel={stock.item?.maxStockLevel}
                        />
                        <div>
                          <div className="font-medium">{stock.item?.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {stock.item?.sku || '—'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {available.toFixed(2)} {stock.item?.unit}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stock.reservedQuantity.toFixed(2)} {stock.item?.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(stock.averageCost)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(totalValue)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/dashboard/inventory/movements?itemId=${stock.itemId}` as any}>
                          История
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={7} className="p-0">
                        <div className="px-6 py-4">
                          <StockRowDetails stock={stock} />
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

interface StockRowDetailsProps {
  stock: IStock
}

function StockRowDetails({ stock }: StockRowDetailsProps) {
  const available = stock.quantity - stock.reservedQuantity
  const totalValue = stock.quantity * stock.averageCost

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Stock Details */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-muted-foreground">Остатки</h4>
        <div className="rounded-md border bg-background p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Всего:</span>
            <span className="font-medium">
              {stock.quantity.toFixed(2)} {stock.item?.unit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Резерв:</span>
            <span>
              {stock.reservedQuantity.toFixed(2)} {stock.item?.unit}
              {stock.reservedQuantity > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                  (для заказов)
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-muted-foreground">Доступно:</span>
            <span className="font-medium">
              {available.toFixed(2)} {stock.item?.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Cost Information */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-muted-foreground">Себестоимость</h4>
        <div className="rounded-md border bg-background p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Средняя (WAC):</span>
            <span className="font-medium">{formatPrice(stock.averageCost)}/{stock.item?.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Посл. закупка:</span>
            <span>
              {formatPrice(stock.lastCost)}/{stock.item?.unit}
              {stock.lastMovementAt && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({format(new Date(stock.lastMovementAt), 'dd MMM', { locale: ru })})
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-muted-foreground">Общая стоим.:</span>
            <span className="font-medium">{formatPrice(totalValue)}</span>
          </div>
        </div>
      </div>

      {/* Thresholds */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-muted-foreground">Пороговые значения</h4>
        <div className="rounded-md border bg-background p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Мин. уровень:</span>
            <span className={stock.quantity <= (stock.item?.minStockLevel ?? 0) ? 'text-destructive font-medium' : ''}>
              {stock.item?.minStockLevel ?? '—'} {stock.item?.minStockLevel ? stock.item.unit : ''}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Точка заказа:</span>
            <span className={stock.quantity <= (stock.item?.reorderPoint ?? 0) ? 'text-amber-600 font-medium' : ''}>
              {stock.item?.reorderPoint ?? '—'} {stock.item?.reorderPoint ? stock.item.unit : ''}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Макс. уровень:</span>
            <span className={stock.quantity > (stock.item?.maxStockLevel ?? Infinity) ? 'text-amber-600 font-medium' : ''}>
              {stock.item?.maxStockLevel ?? '—'} {stock.item?.maxStockLevel ? stock.item.unit : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
